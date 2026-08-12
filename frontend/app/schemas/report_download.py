
from datetime import datetime
from app.utils.round_slots import generate_round_slots

# -----------------------------
# Generate Scan Report
# -----------------------------
def generate_report(db, campus_code: str, report_date: str):
    if not db:
        raise RuntimeError("Supabase client not initialized")

    # 1️⃣ Fetch campus details (THIS WAS MISSING)
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

    # 2️⃣ Generate round slots
    round_slots = generate_round_slots(report_date)

    # 3️⃣ Fetch QR codes
    qr_codes = (
        db.table("qr")
        .select("qr_id, qr_name")
        .eq("campus_code", campus_code)
        .execute()
        .data or []
    )

    # 4️⃣ Fetch scans
    scans = (
        db.table("scanning_details")
        .select("*")
        .eq("campus_code", campus_code)
        .gte("scan_time", f"{report_date}T00:00:00+05:30")
        .lte("scan_time", f"{report_date}T23:59:59+05:30")
        .execute()
        .data or []
    )

    # 5️⃣ Build report rows
    report = []

    for qr in qr_codes:
        for round_no, slot in round_slots:
            scan = next(
                (
                    s for s in scans
                    if s.get("qr_id") == qr.get("qr_id")
                    and s.get("round_slot") == slot.isoformat()
                ),
                None
            )

            report.append({
                "qr_name": qr.get("qr_name"),
                "round": round_no,
                "scan_time": scan.get("scan_time") if scan else None,
                "lat": scan.get("lat") if scan else None,
                "log": scan.get("log") if scan else None,
                "guard_name": scan.get("guard_name") if scan else None,
                "status": "SUCCESS" if scan else "FAILED",
            })

    # 6️⃣ FINAL RESPONSE (FACTORY DATA INCLUDED ONCE)
    return {
        "campus_code": campus_code,
        "campus_name": campus.get("campus_name"),
        "campus_address": campus.get("campus_address"),
        "report_date": report_date,
        "data": report
    }
