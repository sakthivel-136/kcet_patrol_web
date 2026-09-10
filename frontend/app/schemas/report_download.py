
from datetime import datetime
import pytz
from app.utils.round_slots import generate_round_slots

IST = pytz.timezone("Asia/Kolkata")

# -----------------------------
# Generate Scan Report
# -----------------------------
def generate_report(db, campus_code: str, report_date: str):
    if not db:
        raise RuntimeError("Supabase client not initialized")

    # 1️⃣ Fetch campus details
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

    # 2️⃣ Generate round slots (12 rounds, 2 hours each)
    round_slots = generate_round_slots(report_date)

    # 3️⃣ Fetch QR codes
    qr_codes = (
        db.table("qr")
        .select("qr_id, qr_name")
        .eq("campus_code", campus_code)
        .execute()
        .data or []
    )

    # 4️⃣ Fetch scans for the report date
    scans = (
        db.table("scanning_details")
        .select("*")
        .eq("campus_code", campus_code)
        .gte("scan_time", f"{report_date}T00:00:00+05:30")
        .lte("scan_time", f"{report_date}T23:59:59+05:30")
        .execute()
        .data or []
    )

    # 4b. Parse scan_time of each scan into IST datetime for range matching
    for s in scans:
        raw_st = s.get("scan_time")
        if not raw_st:
            s["scan_dt"] = None
            continue
        try:
            dt = datetime.fromisoformat(str(raw_st).replace("Z", "+00:00"))
            s["scan_dt"] = dt.astimezone(IST) if dt.tzinfo else IST.localize(dt)
        except Exception:
            s["scan_dt"] = None

    # 5️⃣ Build report rows — match by time range [start_dt, end_dt)
    report = []

    for qr in qr_codes:
        qr_id = str(qr.get("qr_id"))
        for round_no, start_dt, end_dt in round_slots:
            scan = next(
                (
                    s for s in scans
                    if str(s.get("qr_id")) == qr_id
                    and s.get("scan_dt") is not None
                    and start_dt <= s["scan_dt"] < end_dt
                ),
                None
            )

            scan_time_val = scan.get("scan_time") if scan else None

            report.append({
                "qr_name": qr.get("qr_name"),
                "round": round_no,
                "scan_time": scan_time_val,
                "lat": scan.get("lat") if scan else None,
                "log": scan.get("log") if scan else None,
                "guard_name": scan.get("guard_name") if scan else None,
                "status": "SUCCESS" if scan else "MISSED",
                "date": str(scan_time_val)[:10] if scan_time_val else report_date,
            })

    # 6️⃣ FINAL RESPONSE
    return {
        "campus_code": campus_code,
        "campus_name": campus.get("campus_name"),
        "campus_address": campus.get("campus_address"),
        "report_date": report_date,
        "data": report
    }
