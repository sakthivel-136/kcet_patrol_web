import os
import sys
import argparse
from datetime import datetime, timedelta
import pytz

sys.path.append(os.path.join(os.path.dirname(__file__)))
from app.database import supabase

IST = pytz.timezone("Asia/Kolkata")

def run_cron():
    now_ist = datetime.now(IST)
    
    # We want to evaluate the round that just ended.
    # The scan window is 45 minutes to 1 hour 30 minutes past the 2-hour interval.
    # E.g., for the 00:00 round, the window is 00:45 to 01:30.
    # If the script runs at e.g., 01:35, we want to evaluate the 00:00 round.
    
    # Let's find the most recently closed window.
    # A window closes at (h + 1):30 for every even hour 'h'.
    # So if now is 01:35, the last closed window was for round 00:00 (closed at 01:30).
    # If now is 03:00, the last closed window was for round 02:00 (closed at 03:30).
    
    # We can calculate the last even hour before (now - 1h 30m).
    effective_time = now_ist - timedelta(hours=1, minutes=30)
    last_even_hour = effective_time.hour - (effective_time.hour % 2)
    
    nominal = now_ist.replace(hour=last_even_hour, minute=0, second=0, microsecond=0)
    # Handle if effective time crossed midnight into yesterday
    if effective_time.day != now_ist.day:
        nominal = nominal - timedelta(days=1)
        
    start_dt = nominal + timedelta(minutes=45)
    end_dt = nominal + timedelta(hours=1, minutes=30)
    
    # The round slot timestamp string used in DB is the `start_dt` of the window.
    # Wait, the `round_slots.py` in the backend uses `start` and `end`.
    # Let's check how `round_slot` is being saved in `scanning_details`.
    # Previously, it was start_dt.isoformat().
    slot_iso = start_dt.isoformat()
    scan_time_iso = end_dt.isoformat()
    
    round_no = (last_even_hour // 2) + 1
    
    print(f"[{now_ist.isoformat()}] Evaluating missed scans for Round {round_no} ({start_dt.strftime('%H:%M')} to {end_dt.strftime('%H:%M')})")
    print(f"Using slot_iso: {slot_iso}")

    # Get all campuses
    campuses = supabase.table("campuses").select("campus_code").execute().data or []
    
    inserted_count = 0
    for c in campuses:
        c_code = c["campus_code"]
        # Active QRs
        qrs = supabase.table("qr").select("qr_id, qr_name").eq("campus_code", c_code).eq("status", "active").execute().data or []
        
        for qr in qrs:
            qr_id_str = str(qr["qr_id"])
            
            # Check if scan exists for this round
            # We can check by round_slot, or by scan_time between start_dt and end_dt
            # But the flutter app actually posts the scan with the current time.
            # Let's check if there is ANY scan for this qr_id within the window.
            
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
                    "guard_name": "SYSTEM_MISSED",
                    "lat": 0,
                    "log": 0,
                    "status": "MISSED",
                    "round_slot": slot_iso,
                    "scan_time": scan_time_iso
                }).execute()
                print(f"  -> Inserted MISSED for QR {qr['qr_name']} (ID: {qr_id_str})")
                inserted_count += 1

    print(f"Total inserted: {inserted_count}\n")

if __name__ == "__main__":
    run_cron()
