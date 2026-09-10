# app/routes/report.py
# KEY INSIGHT:
# - For MISSED rows inserted by cron: scan_time = when cron ran (NOT the round time)
#                                     round_slot = the scheduled round start time
# - For SUCCESS rows inserted by guard: scan_time = actual guard scan time
#                                       round_slot = scheduled round slot
#
# Therefore:
#   - Use round_slot to match each record to its correct 12-round window
#   - Show scan_time only for SUCCESS records (real guard scan time)
#   - Show "-" for MISSED records

from fastapi import APIRouter, Depends, Query
from datetime import datetime
import pytz

from app.database import get_db
from app.utils.round_slots import generate_round_slots


router = APIRouter(prefix="/report", tags=["Report"])

IST = pytz.timezone("Asia/Kolkata")


def parse_to_ist(raw: str) -> datetime | None:
    """Parse an ISO timestamp string into an IST-aware datetime."""
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

        # ==============================
        # 1. Generate 12 round windows
        # ==============================
        round_slots = generate_round_slots(report_date)

        # ==============================
        # 2. Fetch QR codes
        # ==============================
        qr_codes = (
            db.table("qr")
            .select("qr_id, qr_name")
            .eq("campus_code", campus_code)
            .execute()
            .data or []
        )

        # ==============================
        # 3. Fetch ALL scans for the date
        #    (filter by round_slot date — not scan_time —
        #     because cron-inserted MISSED records have scan_time = now())
        # ==============================
        scans = (
            db.table("scanning_details")
            .select("id, qr_id, guard_name, scan_time, lat, log, status, round_slot")
            .eq("campus_code", campus_code)
            .gte("round_slot", f"{report_date}T00:00:00+05:30")
            .lte("round_slot", f"{report_date}T23:59:59+05:30")
            .execute()
            .data or []
        )

        # ==============================
        # 4. Parse each scan's round_slot into IST datetime
        #    (used to assign it to the correct 12-round window)
        # ==============================
        for s in scans:
            s["slot_dt"] = parse_to_ist(s.get("round_slot"))

        # ==============================
        # 5. Build report
        #    - Match scan to round via round_slot time window
        #    - Show scan_time only for SUCCESS (real guard scan time)
        # ==============================
        report = []

        for qr in qr_codes:
            qr_id = str(qr["qr_id"])

            for round_no, start_dt, end_dt in round_slots:

                # Match: same qr AND round_slot falls in this 2-hour window
                scan = next(
                    (
                        s for s in scans
                        if str(s.get("qr_id")) == qr_id
                        and s.get("slot_dt") is not None
                        and start_dt <= s["slot_dt"] < end_dt
                    ),
                    None
                )

                if scan:
                    raw_status = (scan.get("status") or "").lower()
                    status = "SUCCESS" if raw_status in ["success", "completed", "done"] else "MISSED"
                else:
                    status = "MISSED"

                # For SUCCESS: use the real scan_time from DB (actual guard scan timestamp)
                # For MISSED:  None — cron scan_time is meaningless (it's when cron ran)
                if status == "SUCCESS" and scan:
                    scan_time_val = scan.get("scan_time")
                else:
                    scan_time_val = None

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
