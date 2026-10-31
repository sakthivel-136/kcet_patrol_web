# app/main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

# -----------------------------
# Import routers
# -----------------------------
from app.routes import (
    auth,
    admin,
    campuses,
    scan_points,
    security_users,
    qr,
    scanning_details,
    report_download,
    shifts,
    allocations,
    rounds
)

# Dependency for JWT authentication
from app.dependencies import get_current_user


# -----------------------------
# Initialize FastAPI app
# -----------------------------
app = FastAPI(
    title="Security Verifier API",
    version="1.0.0",
    description="Backend API for Security Verifier system"
)


# -----------------------------
# CORS CONFIGURATION
# -----------------------------
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Include routers
# -----------------------------

# 🔓 Auth → Open access
app.include_router(auth.router)

# 🔐 Admin → JWT required (Protected)
app.include_router(
    admin.router,
    dependencies=[Depends(get_current_user)]
)

# 🏭 Campuses
app.include_router(campuses.router)

# 📍 Scan Points
app.include_router(scan_points.router)

# 👮 Security Users
app.include_router(security_users.router)

# 🔳 QR Codes
app.include_router(qr.router)

# 📲 Scanning (Mobile)
app.include_router(scanning_details.router)

# 📄 Report Download (Patrol Report)
app.include_router(report_download.router)

# 🕒 Shifts
app.include_router(shifts.router)

# 🔄 Rounds
app.include_router(rounds.router)

# 📅 Shift Allocations
app.include_router(allocations.router)

# -----------------------------
# Root endpoint
# -----------------------------

# -----------------------------
# Supabase Webhook Endpoint (Option 1)
# -----------------------------
from fastapi import Request
from app.d1_client import query_d1
import dateutil.parser
import pytz

IST = pytz.timezone("Asia/Kolkata")

@app.post("/api/supabase-webhook", summary="Real-time Webhook Receiver from Supabase")
async def supabase_webhook(request: Request):
    try:
        payload = await request.json()
        # Supabase webhooks send: { "type": "INSERT", "table": "scanning_details", "record": { ... } }
        # Or raw record if direct POST
        record = payload.get("record") if "record" in payload else payload
        if not record or not isinstance(record, dict):
            return {"status": "ignored", "reason": "No valid record found"}

        record_id = record.get("id")
        guard_name = record.get("guard_name")
        qr_id = str(record.get("qr_id", ""))
        qr_name = record.get("qr_name")
        lat = record.get("lat")
        log = record.get("log")
        status_val = record.get("status")
        campus_code = record.get("campus_code", "KCET01")
        scan_time = record.get("scan_time")
        round_slot = record.get("round_slot")
        round_number = record.get("round_number")
        round_time = record.get("round_time")

        # Calculate round_number if missing
        if not round_number and scan_time:
            try:
                dt = dateutil.parser.parse(scan_time)
                if dt.tzinfo is None:
                    dt = IST.localize(dt)
                else:
                    dt = dt.astimezone(IST)
                h = dt.hour
                round_number = (h // 2) + 1
            except Exception as e:
                print("Error calculating round_number:", e)

        # Delete any previous MISSED record for this QR & round
        if status_val == "SUCCESS" and round_number:
            query_d1(
                "DELETE FROM scanning_details WHERE qr_id = ? AND round_number = ? AND status = 'MISSED'",
                [qr_id, str(round_number)]
            )

        # Insert or replace into Cloudflare D1
        columns = ['id', 'guard_name', 'qr_id', 'qr_name', 'lat', 'log', 'status', 'campus_code', 'scan_time', 'round_slot', 'round_number', 'round_time']
        values = [record_id, guard_name, qr_id, qr_name, lat, log, status_val, campus_code, scan_time, round_slot, str(round_number) if round_number else None, round_time]
        
        placeholders = ", ".join(["?"] * len(columns))
        col_str = ", ".join(columns)
        insert_sql = f"INSERT OR REPLACE INTO scanning_details ({col_str}) VALUES ({placeholders})"
        
        query_d1(insert_sql, values)
        print(f"Webhook forwarded scan {record_id} ({guard_name} - {qr_name}) directly to D1 ✅")
        return {"status": "success", "synced_id": record_id}

    except Exception as e:
        print("Webhook processing error:", e)
        return {"status": "error", "message": str(e)}

@app.get("/", summary="API Root")
def root():
    return {
        "message": "Security Verifier API is running ✅"
    }

# -----------------------------
# Cron endpoint
# -----------------------------
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from cron_mark_missed import run_cron

@app.get("/cron/mark-missed", summary="Cron Endpoint to Mark Missed Scans")
def cron_mark_missed():
    try:
        run_cron()
        return {"status": "success", "message": "Missed scans evaluated successfully."}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/cron/end-of-day-cleanup", summary="End of Day Sync & Cleanup from Supabase")
def end_of_day_cleanup():
    """
    Runs at midnight / end of day (e.g. 23:59 IST):
    1. Ensures all scans from today are securely synced to Cloudflare D1.
    2. Deletes today's and older synced scans from Supabase to keep Supabase clean.
    """
    try:
        import requests
        from datetime import datetime, timedelta
        import pytz
        from app.d1_client import query_d1

        IST = pytz.timezone("Asia/Kolkata")
        now_ist = datetime.now(IST)
        
        from app.config import SUPABASE_URL, SUPABASE_KEY
        SUPABASE_URL = SUPABASE_URL or "https://jnzvystfghhhvvnmkygj.supabase.co"
        sb_headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }

        # 1. Fetch all scans currently in Supabase (up to today midnight)
        cutoff_iso = now_ist.strftime("%Y-%m-%dT23:59:59+05:30")
        sb_res = requests.get(
            f"{SUPABASE_URL}/rest/v1/scanning_details",
            headers=sb_headers,
            params={"scan_time": f"lte.{cutoff_iso}", "order": "id.asc", "limit": 1000},
            timeout=15
        )
        if not sb_res.ok:
            return {"status": "error", "message": f"Failed to fetch Supabase scans: {sb_res.text}"}

        sb_scans = sb_res.json()
        print(f"End of day cleanup found {len(sb_scans)} scans in Supabase to verify/sync.")

        columns = ['id', 'guard_name', 'qr_id', 'qr_name', 'lat', 'log', 'status', 'campus_code', 'scan_time', 'round_slot', 'round_number', 'round_time']
        col_str = ", ".join(columns)
        val_placeholders = ", ".join(["?"] * len(columns))

        # 2. Ensure each scan is preserved in Cloudflare D1 using chunked batch inserts (8 rows per request)
        synced_count = 0
        batch_size = 8
        for i in range(0, len(sb_scans), batch_size):
            batch = sb_scans[i:i + batch_size]
            values_clause = []
            flat_params = []
            for s in batch:
                sid = s.get("id")
                r_num = s.get("round_number")
                if not r_num and s.get("scan_time"):
                    try:
                        import dateutil.parser
                        dt = dateutil.parser.parse(s["scan_time"])
                        if dt.tzinfo is None:
                            dt = IST.localize(dt)
                        else:
                            dt = dt.astimezone(IST)
                        r_num = (dt.hour // 2) + 1
                    except Exception:
                        r_num = None

                values_clause.append(f"({val_placeholders})")
                flat_params.extend([
                    sid, s.get("guard_name"), str(s.get("qr_id", "")), s.get("qr_name"),
                    s.get("lat"), s.get("log"), s.get("status"), s.get("campus_code", "KCET01"),
                    s.get("scan_time"), s.get("round_slot"), str(r_num) if r_num else None, s.get("round_time")
                ])
            batch_sql = f"INSERT OR REPLACE INTO scanning_details ({col_str}) VALUES {', '.join(values_clause)}"
            query_d1(batch_sql, flat_params)
            synced_count += len(batch)

        # 3. Safe to delete from Supabase
        del_res = requests.delete(
            f"{SUPABASE_URL}/rest/v1/scanning_details",
            headers=sb_headers,
            params={"scan_time": f"lte.{cutoff_iso}"},
            timeout=15
        )

        return {
            "status": "success",
            "message": "End-of-day cleanup completed successfully.",
            "synced_to_d1": synced_count,
            "deleted_from_supabase_status": del_res.status_code
        }

    except Exception as e:
        print("End of day cleanup error:", e)
        return {"status": "error", "message": str(e)}
