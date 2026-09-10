# app/routes/report.py
#
# HOW THE DB WORKS:
# ─────────────────────────────────────────────────────────────────
# SUCCESS rows (guard scanned):
#   scan_time  = actual guard scan timestamp  ← show this as time
#   round_slot = NULL  (mobile app does NOT set it)
#
# MISSED rows (cron inserted):
#   scan_time  = end_dt of the round (e.g. 06:20 AM)
#   round_slot = start_dt of the round (e.g. 05:50 AM)
#
# STRATEGY:
#   1. Fetch all rows where scan_time is on report_date  → gets SUCCESS + most MISSED
#   2. Fetch all rows where round_slot is on report_date → gets all MISSED
#   3. Merge (deduplicate by id)
#   4. For round matching:
#        - If round_slot is present → use round_slot to assign round
#        - If round_slot is null    → use scan_time to assign round (SUCCESS)
#   5. For display:
#        - SUCCESS: show scan_time (real guard scan time)
#        - MISSED:  show "-"
# ─────────────────────────────────────────────────────────────────

from fastapi import APIRouter, Depends, Query
from datetime import datetime
import pytz

from app.database import get_db
from app.utils.round_slots import generate_round_slots

router = APIRouter(prefix="/report", tags=["Report"])
IST = pytz.timezone("Asia/Kolkata")


def parse_to_ist(raw):
    """Parse an ISO timestamp string into an IST-aware datetime. Returns None if invalid."""
    if not raw:
        return None
    try:
        dt = datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
        return dt.astimezone(IST) if dt.tzinfo else IST.localize(dt)
    except Exception:
        return None


@router.get("/download")
def download_report(
    campus_code: str = Query(...),
    report_date: str = Query(...),
    db=Depends(get_db),
):
    try:
        # 1. Generate 12 round windows (2 hrs each, matching frontend ROUND_TIMES)
        round_slots = generate_round_slots(report_date)

        # 2. Fetch QR codes for this campus
        qr_codes = (
            db.table("qr")
            .select("qr_id, qr_name")
            .eq("campus_code", campus_code)
            .execute()
            .data or []
        )

        # 3a. Fetch rows where scan_time is on report_date
        #     (captures SUCCESS rows from mobile app + most MISSED rows)
        scans_by_scan_time = (
            db.table("scanning_details")
            .select("id, qr_id, guard_name, scan_time, lat, log, status, round_slot")
            .eq("campus_code", campus_code)
            .gte("scan_time", f"{report_date}T00:00:00+05:30")
            .lte("scan_time", f"{report_date}T23:59:59+05:30")
            .execute()
            .data or []
        )

        # 3b. Fetch rows where round_slot is on report_date
        #     (captures all MISSED rows that might have a different scan_time date)
        scans_by_round_slot = (
            db.table("scanning_details")
            .select("id, qr_id, guard_name, scan_time, lat, log, status, round_slot")
            .eq("campus_code", campus_code)
            .gte("round_slot", f"{report_date}T00:00:00+05:30")
            .lte("round_slot", f"{report_date}T23:59:59+05:30")
            .execute()
            .data or []
        )

        # 3c. Merge and deduplicate by id
        seen_ids = set()
        scans = []
        for s in (scans_by_scan_time + scans_by_round_slot):
            sid = s.get("id")
            if sid not in seen_ids:
                seen_ids.add(sid)
                scans.append(s)

        # 4. Parse timestamps for round matching
        for s in scans:
            # Use round_slot for MISSED rows; scan_time for SUCCESS rows
            rs = s.get("round_slot")
            st = s.get("scan_time")
            if rs:
                s["match_dt"] = parse_to_ist(rs)   # MISSED: match by round_slot
            else:
                s["match_dt"] = parse_to_ist(st)   # SUCCESS: match by scan_time

        # 5. Build the report — one row per (qr, round)
        report = []

        for qr in qr_codes:
            qr_id = str(qr["qr_id"])

            for round_no, start_dt, end_dt in round_slots:

                # Find scan that belongs to this round
                scan = next(
                    (
                        s for s in scans
                        if str(s.get("qr_id")) == qr_id
                        and s.get("match_dt") is not None
                        and start_dt <= s["match_dt"] < end_dt
                    ),
                    None
                )

                if scan:
                    raw_status = (scan.get("status") or "").lower()
                    status = "SUCCESS" if raw_status in ["success", "completed", "done"] else "MISSED"
                else:
                    status = "MISSED"

                # Show scan_time ONLY for SUCCESS (real guard scan time)
                # MISSED rows: scan_time is cron-set, not meaningful — show "-"
                scan_time_val = scan.get("scan_time") if (scan and status == "SUCCESS") else None

                report.append({
                    "qr_name":    qr["qr_name"],
                    "round":      round_no,
                    "scan_time":  scan_time_val,
                    "lat":        scan.get("lat") if scan else None,
                    "lon":        scan.get("log") if scan else None,
                    "guard_name": scan.get("guard_name") if scan else None,
                    "status":     status,
                    "date":       str(scan_time_val)[:10] if scan_time_val else report_date,
                })

        return report

    except Exception as e:
        print("❌ REPORT ERROR:", e)
        return {"success": False, "message": str(e)}
