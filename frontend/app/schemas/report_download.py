from datetime import datetime
import pytz
from app.utils.round_slots import generate_round_slots

IST = pytz.timezone("Asia/Kolkata")


def parse_to_ist(raw: str):
    if not raw:
        return None
    try:
        dt = datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
        return dt.astimezone(IST) if dt.tzinfo else IST.localize(dt)
    except Exception:
        return None


def generate_report(db, campus_code: str, report_date: str):
    if not db:
        raise RuntimeError("Supabase client not initialized")

    campus = (
        db.table("campuses")
        .select("campus_name, campus_address")
        .eq("campus_code", campus_code)
        .single()
        .execute()
        .data
    )

    if not campus:
        raise ValueError("Campus not found")

    round_slots = generate_round_slots(report_date)

    qr_codes = (
        db.table("qr")
        .select("qr_id, qr_name")
        .eq("campus_code", campus_code)
        .execute()
        .data or []
    )

    # Filter by round_slot date (not scan_time) — cron MISSED records have scan_time = now()
    scans = (
        db.table("scanning_details")
        .select("*")
        .eq("campus_code", campus_code)
        .gte("round_slot", f"{report_date}T00:00:00+05:30")
        .lte("round_slot", f"{report_date}T23:59:59+05:30")
        .execute()
        .data or []
    )

    for s in scans:
        s["slot_dt"] = parse_to_ist(s.get("round_slot"))

    report = []

    for qr in qr_codes:
        qr_id = str(qr.get("qr_id"))

        for round_no, start_dt, end_dt in round_slots:
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

            # Show real scan_time only for SUCCESS rows
            scan_time_val = scan.get("scan_time") if (scan and status == "SUCCESS") else None

            report.append({
                "qr_name":    qr.get("qr_name"),
                "round":      round_no,
                "scan_time":  scan_time_val,
                "lat":        scan.get("lat") if scan else None,
                "log":        scan.get("log") if scan else None,
                "guard_name": scan.get("guard_name") if scan else None,
                "status":     status,
                "date":       str(scan_time_val)[:10] if scan_time_val else report_date,
            })

    return {
        "campus_code":    campus_code,
        "campus_name":    campus.get("campus_name"),
        "campus_address": campus.get("campus_address"),
        "report_date":    report_date,
        "data":           report,
    }
