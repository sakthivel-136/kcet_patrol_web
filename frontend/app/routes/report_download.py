# app/routes/report.py

from fastapi import APIRouter, Depends, Query
from datetime import datetime
import pytz

from app.database import get_db
from app.utils.round_slots import generate_round_slots


router = APIRouter(prefix="/report", tags=["Report"])

IST = pytz.timezone("Asia/Kolkata")


@router.get("/download")
def download_report(
    campus_code: str = Query(...),
    report_date: str = Query(...),
    db=Depends(get_db),
):

    try:

        # ==============================
        # 1. Generate rounds
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
        # 3. Fetch scan logs
        # ==============================
        scans = (
            db.table("scanning_details")
            .select("id, qr_id, guard_name, scan_time, lat, log, status, round_slot")
            .eq("campus_code", campus_code)
            .gte("scan_time", f"{report_date}T00:00:00+05:30")
            .lte("scan_time", f"{report_date}T23:59:59+05:30")
            .execute()
            .data or []
        )


        # ==============================
        # 4. Parse scan_time of each DB record into IST datetime for range matching
        # ==============================
        for s in scans:
            raw_st = s.get("scan_time")
            if not raw_st:
                s["scan_dt"] = None
                continue
            try:
                dt = datetime.fromisoformat(str(raw_st).replace("Z", "+00:00"))
                if dt.tzinfo is None:
                    dt = IST.localize(dt)
                else:
                    dt = dt.astimezone(IST)
                s["scan_dt"] = dt
            except Exception:
                s["scan_dt"] = None


        # ==============================
        # 5. Build report — match scan to round by time range [start_dt, end_dt)
        # ==============================
        report = []

        for qr in qr_codes:

            qr_id = str(qr["qr_id"])

            for round_no, start_dt, end_dt in round_slots:

                # A scan belongs to this round if its scan_time falls within [start_dt, end_dt)
                scan = next(
                    (
                        s for s in scans
                        if str(s.get("qr_id")) == qr_id
                        and s.get("scan_dt") is not None
                        and start_dt <= s["scan_dt"] < end_dt
                    ),
                    None
                )

                # Normalize status
                if scan:
                    raw = (scan.get("status") or "").lower()
                    status = "SUCCESS" if raw in ["success", "completed", "done"] else "MISSED"
                else:
                    status = "MISSED"

                # Use the real scan_time string from DB for SUCCESS rows; None for MISSED
                scan_time_val = scan.get("scan_time") if scan else None

                report.append({
                    "qr_name": qr["qr_name"],
                    "round": round_no,
                    "scan_time": scan_time_val,
                    "lat": scan.get("lat") if scan else None,
                    "lon": scan.get("log") if scan else None,
                    "guard_name": scan.get("guard_name") if scan else None,
                    "status": status,
                    "date": str(scan_time_val)[:10] if scan_time_val else report_date,
                })

        return report


    except Exception as e:

        print("❌ REPORT ERROR:", e)

        return {
            "success": False,
            "message": str(e)
        }
