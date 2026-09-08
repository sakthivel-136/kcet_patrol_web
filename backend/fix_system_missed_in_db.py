import os
import sys
from datetime import datetime
import pytz

sys.path.append(os.path.join(os.path.dirname(__file__)))
from app.database import supabase

def get_guards_for_time(scan_time_str, round_slot_str, shifts, allocations, security_users):
    time_str = scan_time_str or round_slot_str
    if not time_str:
        return ""
    
    try:
        safe_t = str(time_str).replace(" ", "T")
        if "T" in safe_t:
            t_part = safe_t.split("T")[1].split(".")[0].split("+")[0].split("-")[0]
        else:
            t_part = safe_t.split()[0]
        
        parts = t_part.split(":")
        s_h, s_m = int(parts[0]), int(parts[1])
        w_mins = s_h * 60 + s_m
    except Exception:
        return ""

    matching_shift = None
    for s in shifts:
        start_str = s.get("start_time")
        end_str = s.get("end_time")
        if not start_str or not end_str:
            continue
        try:
            sh, sm = map(int, start_str.split(":")[:2])
            eh, em = map(int, end_str.split(":")[:2])
            start_mins = sh * 60 + sm
            end_mins = eh * 60 + em

            if end_mins <= start_mins: # Overnight shift
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
        str(a.get("security_id")).strip()
        for a in allocations
        if str(a.get("shift_id")).strip() == shift_id and str(a.get("security_id")).strip() != "CLEAR"
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

    return ", ".join(list(dict.fromkeys(guard_names)))

def fix_db_records():
    print("Fetching shifts, allocations, security_users from Supabase...")
    shifts = supabase.table("shifts").select("shift_id, shift_name, start_time, end_time").execute().data or []
    allocations = supabase.table("shift_allocations").select("shift_id, security_id").execute().data or []
    security_users = supabase.table("security_users").select("security_id, security_name").execute().data or []

    print(f"Loaded {len(shifts)} shifts, {len(allocations)} allocations, {len(security_users)} users.")

    total_all_updated = 0
    while True:
        res_sm = supabase.table("scanning_details").select("id, scan_time, round_slot, guard_name").eq("guard_name", "SYSTEM_MISSED").limit(1000).execute()
        records = res_sm.data or []

        res_ag = supabase.table("scanning_details").select("id, scan_time, round_slot, guard_name").eq("guard_name", "Allotted Guard").limit(1000).execute()
        if res_ag.data:
            records.extend(res_ag.data)

        if not records:
            print(f"\nAll done! 0 records remaining with 'SYSTEM_MISSED' or 'Allotted Guard'. Total updated across runs: {total_all_updated}")
            break

        print(f"Found batch of {len(records)} records to fix in DB...")
        updated_count = 0
        for r in records:
            rec_id = r["id"]
            guard_names_str = get_guards_for_time(r.get("scan_time"), r.get("round_slot"), shifts, allocations, security_users)
            new_name = guard_names_str if guard_names_str else "-"

            supabase.table("scanning_details").update({"guard_name": new_name}).eq("id", rec_id).execute()
            updated_count += 1
            total_all_updated += 1

        print(f"Batch completed: Updated {updated_count} records. Total so far: {total_all_updated}")

if __name__ == "__main__":
    fix_db_records()
