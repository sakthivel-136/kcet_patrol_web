import os
import sys
import argparse
from datetime import datetime, timedelta
import pytz

sys.path.append(os.path.join(os.path.dirname(__file__)))
from app.database import supabase

IST = pytz.timezone("Asia/Kolkata")

def get_guards_for_window(window_start_dt, shifts, allocations, security_users):
    """
    Finds shift matching window_start_dt and returns comma-separated names of assigned guards.
    """
    w_h, w_m = window_start_dt.hour, window_start_dt.minute
    w_mins = w_h * 60 + w_m

    matching_shift = None
    for s in shifts:
        start_str = s.get("start_time")
        end_str = s.get("end_time")
        if not start_str or not end_str:
            continue
        try:
            s_h, s_m = map(int, start_str.split(":")[:2])
            e_h, e_m = map(int, end_str.split(":")[:2])
            start_mins = s_h * 60 + s_m
            end_mins = e_h * 60 + e_m

            if end_mins <= start_mins: # Overnight shift (e.g. 22:00 to 06:00)
                if w_mins >= start_mins or w_mins < end_mins:
                    matching_shift = s
                    break
            else:
                if start_mins <= w_mins < end_mins:
                    matching_shift = s
                    break
        except Exception:
            continue

    if not matching_shift:
        return ""

    shift_id = str(matching_shift["shift_id"])
    assigned_guard_ids = [
        str(a.get("guard_id")).strip()
        for a in allocations
        if str(a.get("shift_id")).strip() == shift_id and str(a.get("guard_id")).strip() != "CLEAR"
    ]

    user_map = {}
    for u in security_users:
        sec_id = str(u.get("security_id", "")).strip()
        sec_name = str(u.get("security_name", "")).strip()
        if sec_id and sec_name:
            user_map[sec_id] = sec_name

    guard_names = []
    for g_id in assigned_guard_ids:
        if g_id in user_map:
            name = user_map[g_id]
            if name.upper() != "SYSTEM_MISSED":
                guard_names.append(name)
        elif g_id.upper() != "SYSTEM_MISSED":
            guard_names.append(g_id)

    # Return comma-separated list of unique guard names
    unique_names = list(dict.fromkeys(guard_names))
    return ", ".join(unique_names)


def run_cron():
    now_ist = datetime.now(IST)
    
    # We want to evaluate the round that just ended.
    effective_time = now_ist - timedelta(hours=1, minutes=30)
    last_even_hour = effective_time.hour - (effective_time.hour % 2)
    
    nominal = now_ist.replace(hour=last_even_hour, minute=0, second=0, microsecond=0)
    if effective_time.day != now_ist.day:
        nominal = nominal - timedelta(days=1)
        
    start_dt = nominal + timedelta(minutes=45)
    end_dt = nominal + timedelta(hours=1, minutes=30)
    
    slot_iso = start_dt.isoformat()
    scan_time_iso = end_dt.isoformat()
    
    round_no = (last_even_hour // 2) + 1
    
    print(f"[{now_ist.isoformat()}] Evaluating missed scans for Round {round_no} ({start_dt.strftime('%H:%M')} to {end_dt.strftime('%H:%M')})")
    print(f"Using slot_iso: {slot_iso}")

    # Fetch shifts, allocations, and security_users to resolve guard names from DB roster
    shifts = supabase.table("shifts").select("shift_id, shift_name, start_time, end_time").execute().data or []
    allocations = supabase.table("shift_allocations").select("shift_id, guard_id").execute().data or []
    security_users = supabase.table("security_users").select("security_id, security_name").execute().data or []

    # Get guards assigned to this round's shift
    assigned_guards_str = get_guards_for_window(start_dt, shifts, allocations, security_users)
    guard_name_to_insert = assigned_guards_str if assigned_guards_str else "-"

    print(f"  -> Assigned guards for Round {round_no}: '{guard_name_to_insert}'")

    # Get all campuses
    campuses = supabase.table("campuses").select("campus_code").execute().data or []
    
    inserted_count = 0
    for c in campuses:
        c_code = c["campus_code"]
        # Active QRs
        qrs = supabase.table("qr").select("qr_id, qr_name").eq("campus_code", c_code).eq("status", "active").execute().data or []
        
        for qr in qrs:
            qr_id_str = str(qr["qr_id"])
            
            existing = supabase.table("scanning_details").select("id") \
                .eq("qr_id", qr_id_str) \
                .gte("scan_time", start_dt.isoformat()) \
                .lte("scan_time", end_dt.isoformat()) \
                .execute().data
            
            if not existing:
                supabase.table("scanning_details").insert({
                    "qr_id": qr_id_str,
                    "qr_name": qr["qr_name"],
                    "campus_code": c_code,
                    "guard_name": guard_name_to_insert,
                    "lat": 0,
                    "log": 0,
                    "status": "MISSED",
                    "round_slot": slot_iso,
                    "scan_time": scan_time_iso
                }).execute()
                print(f"  -> Inserted MISSED for QR {qr['qr_name']} (ID: {qr_id_str}) with guard(s): {guard_name_to_insert}")
                inserted_count += 1

    print(f"Total inserted: {inserted_count}\n")

if __name__ == "__main__":
    run_cron()
