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
    Where start_dt is 45 minutes past the start of the 2-hour interval, and end_dt is 1 hour 30 minutes past.
    """
    base = datetime.strptime(report_date, "%Y-%m-%d")
    base = IST.localize(base)

    slots = []

    for i in range(12):
        h = i * 2
        nominal = base.replace(hour=h, minute=0, second=0)
        
        start = nominal + timedelta(minutes=45)
        end = nominal + timedelta(hours=1, minutes=30)

        slots.append((i + 1, start, end))

    return slots
