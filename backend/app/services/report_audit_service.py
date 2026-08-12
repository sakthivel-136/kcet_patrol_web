# app/services/report_audit_service.py

from datetime import datetime, timezone, timedelta

IST = timezone(timedelta(hours=5, minutes=30))


def save_report_audit(
    db,
    report_type: str,
    campus_code: str,
    report_date: str,
    current_user: dict
):
    if not db:
        raise RuntimeError("Supabase client not initialized")

    audit_payload = {
        "report_type": report_type,
        "campus_code": campus_code,
        "report_date": report_date,
        "generated_by_user_id": current_user["user_id"],
        "generated_by_name": current_user.get("name"),
        "generated_by_role": current_user["role"],
        "generated_at": datetime.now(IST).isoformat(),
    }

    db.table("report_audit").insert(audit_payload).execute()
