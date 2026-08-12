# app/utils/round_slots.py

from datetime import datetime, timedelta
import pytz

IST = pytz.timezone("Asia/Kolkata")

def generate_round_slots(report_date: str):
    """
    Returns:
    [
      (round_no, start_dt, end_dt),
      ...
    ]
    Where start_dt is 10 minutes before the hour, and end_dt is 20 minutes after the hour.
    """
    base = datetime.strptime(report_date, "%Y-%m-%d")
    base = IST.localize(base)

    slots = []

    for h in range(24):
        nominal = base.replace(hour=h, minute=0, second=0)
        
        start = nominal - timedelta(minutes=10)
        end = nominal + timedelta(minutes=20)

        slots.append((h + 1, start, end))

    return slots
