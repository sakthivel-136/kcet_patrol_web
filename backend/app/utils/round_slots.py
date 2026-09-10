# app/utils/round_slots.py
# 12 rounds of 2 hours each — matches frontend roundtime.ts:
#   1: 00:00–02:00, 2: 02:00–04:00, ... 12: 22:00–00:00 (next day)

from datetime import datetime, timedelta
import pytz

IST = pytz.timezone("Asia/Kolkata")


def generate_round_slots(report_date: str):
    """
    Returns list of (round_no, start_dt, end_dt) in IST.
    Matches the 12 rounds used by the frontend ROUND_TIMES exactly.
    Round 12 ends at midnight of the next day.
    """
    base = datetime.strptime(report_date, "%Y-%m-%d")
    base = IST.localize(base)

    slots = []

    for i in range(12):
        h = i * 2
        start = base.replace(hour=h, minute=0, second=0, microsecond=0)

        if i < 11:
            end = base.replace(hour=h + 2, minute=0, second=0, microsecond=0)
        else:
            # Round 12: 22:00 to 00:00 next day
            end = (base + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)

        slots.append((i + 1, start, end))

    return slots
