# app/routes/report.py

from fastapi import APIRouter, Depends, Query
from datetime import datetime
import pytz

from app.database import get_db
from app.utils.round_slots import generate_round_slots
from app.dependencies import get_current_user


router = APIRouter(prefix="/report", tags=["Report"])

IST = pytz.timezone("Asia/Kolkata")

from fastapi import Header, HTTPException
import os


@router.get("/download")
def download_report(
    campus_code: str = Query(...),
    report_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(None, description="End date (YYYY-MM-DD)"),
    db=Depends(get_db),
    _: dict = Depends(get_current_user),
):

    try:
        from datetime import date, timedelta

        # Parse date range
        start_date = report_date
        end_date = end_date or report_date

        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()

        # ==============================
        # 1. Fetch QR codes
        # ==============================
        qr_codes = (
            db.table("qr")
            .select("qr_id, qr_name")
            .eq("campus_code", campus_code)
            .execute()
            .data or []
        )

        # ==============================
        # 2. Fetch ALL scan logs for the range (paginated to avoid 1000-row limit)
        #    Buffer 30 min before start_date to catch guards who begin
        #    Round 1 patrol slightly before midnight
        # ==============================
        scans = []
        page_size = 1000
        offset = 0
        fetch_start = f"{start_date}T00:00:00+05:30"
        # Extend fetch window 30 min before midnight to capture early Round 1 scans
        fetch_start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        fetch_start_dt = IST.localize(fetch_start_dt) - timedelta(minutes=30)
        fetch_start = fetch_start_dt.strftime("%Y-%m-%dT%H:%M:%S+05:30")

        while True:
            batch = (
                db.table("scanning_details")
                .select("id, qr_id, guard_name, scan_time, lat, log, status, round_slot")
                .eq("campus_code", campus_code)
                .gte("scan_time", fetch_start)
                .lte("scan_time", f"{end_date}T23:59:59+05:30")
                .order("scan_time")
                .range(offset, offset + page_size - 1)
                .execute()
                .data or []
            )
            scans.extend(batch)
            if len(batch) < page_size:
                break
            offset += page_size

        # ==============================
        # 3. Parse round_slot and scan_time for all scans
        # ==============================
        for s in scans:
            rs = s.get("round_slot")
            st = s.get("scan_time")

            # Parse round_dt from round_slot
            if rs:
                dt = datetime.fromisoformat(rs.replace("Z", "+00:00"))
                if dt.tzinfo is None:
                    dt = IST.localize(dt)
                else:
                    dt = dt.astimezone(IST)
                s["round_dt"] = dt
            else:
                s["round_dt"] = None

            # Parse scan_dt_ist from scan_time as fallback
            if st:
                dt = datetime.fromisoformat(st.replace("Z", "+00:00"))
                if dt.tzinfo is None:
                    dt = IST.localize(dt)
                else:
                    dt = dt.astimezone(IST)
                s["scan_dt_ist"] = dt
            else:
                s["scan_dt_ist"] = None

        # ==============================
        # 4. Build report day-by-day
        # ==============================
        # Build dictionaries for O(1) lookup
        scans_by_round_qr = {}
        scans_by_qr = {}
        for s in scans:
            qr_id_str = str(s.get("qr_id"))
            round_dt = s.get("round_dt")
            if round_dt:
                scans_by_round_qr[(round_dt, qr_id_str)] = s
            
            if qr_id_str not in scans_by_qr:
                scans_by_qr[qr_id_str] = []
            scans_by_qr[qr_id_str].append(s)

        report = []
        current_dt = start_dt
        now_ist = datetime.now(IST)
        today_str = now_ist.strftime("%Y-%m-%d")

        while current_dt <= end_dt:
            date_str = current_dt.strftime("%Y-%m-%d")
            is_today = (date_str == today_str)
            round_slots = generate_round_slots(date_str)

            for qr in qr_codes:
                qr_id = str(qr["qr_id"])

                for round_no, start_slot_dt, end_slot_dt in round_slots:
                    # O(1) Lookup by round_dt and qr_id
                    scan = scans_by_round_qr.get((start_slot_dt, qr_id))

                    # Fallback for older scans without round_slot
                    if not scan:
                        qr_scans = scans_by_qr.get(qr_id, [])
                        scan = next(
                            (
                                s for s in qr_scans
                                if s.get("scan_dt_ist")
                                and start_slot_dt <= s.get("scan_dt_ist") < end_slot_dt
                            ),
                            None
                        )

                    # Normalize status
                    if scan:
                        raw = (scan.get("status") or "").lower()
                        if raw in ["success", "completed", "done"]:
                            status = "SUCCESS"
                        else:
                            status = "MISSED"
                    else:
                        # Future round (today only) → PENDING, past → MISSED
                        if is_today and start_slot_dt > now_ist:
                            status = "PENDING"
                        else:
                            status = "MISSED"

                    report.append({
                        "qr_name": qr["qr_name"],
                        "round": round_no,
                        "scan_time": scan.get("scan_time") if scan else None,
                        "lat": scan.get("lat") if scan else None,
                        "lon": scan.get("log") if scan else None,
                        "guard_name": scan.get("guard_name") if scan else None,
                        "status": status,
                        "date": date_str,
                    })

            current_dt += timedelta(days=1)

        return report

    except Exception as e:
        print("REPORT ERROR:", e)
        return {
            "success": False,
            "message": str(e)
        }

@router.post("/cron/process-missed")
def process_missed_scans(
    x_cron_secret: str = Header(None),
    db=Depends(get_db)
):
    """
    Called by Supabase pg_cron to automatically insert MISSED records
    for time slots that have already ended.
    """
    expected_secret = os.getenv("CRON_SECRET", "supersecretcron")
    if x_cron_secret != expected_secret:
        raise HTTPException(status_code=401, detail="Unauthorized cron request")

    try:
        from datetime import timedelta
        now_ist = datetime.now(IST)
        today_str = now_ist.strftime("%Y-%m-%d")
        round_slots = generate_round_slots(today_str)
        
        # Only process slots that ended today and are fully in the past
        past_slots = [slot for slot in round_slots if slot[2] <= now_ist]
        
        if not past_slots:
            return {"message": "No completed slots for today yet."}

        # Get all campuses
        campuses = db.table("campuses").select("campus_code").execute().data or []
        
        inserted_count = 0

        for campus in campuses:
            c_code = campus.get("campus_code")
            # Get active QRs for campus
            qrs = db.table("qr").select("qr_id, qr_name").eq("campus_code", c_code).eq("status", "active").execute().data or []
            
            for qr in qrs:
                qr_id_str = str(qr["qr_id"])
                
                # Get all scans for this QR today
                start_of_day = f"{today_str}T00:00:00+05:30"
                scans = db.table("scanning_details").select("round_slot").eq("qr_id", qr_id_str).gte("scan_time", start_of_day).execute().data or []
                existing_slots = {s.get("round_slot") for s in scans if s.get("round_slot")}
                
                # Check against past slots
                for round_no, start_dt, end_dt in past_slots:
                    slot_iso = start_dt.isoformat()
                    
                    if slot_iso not in existing_slots:
                        # Insert MISSED
                        db.table("scanning_details").insert({
                            "qr_id": qr_id_str,
                            "qr_name": qr["qr_name"],
                            "campus_code": c_code,
                            "guard_name": "SYSTEM_CRON",
                            "lat": 0,
                            "log": 0,
                            "status": "MISSED",
                            "round_slot": slot_iso,
                            "scan_time": end_dt.isoformat()
                        }).execute()
                        inserted_count += 1
                        # Add to existing_slots so we don't insert again if we re-check
                        existing_slots.add(slot_iso)
                        
        return {"success": True, "message": f"Inserted {inserted_count} MISSED records."}

    except Exception as e:
        print("CRON ERROR:", e)
        return {"success": False, "message": str(e)}

