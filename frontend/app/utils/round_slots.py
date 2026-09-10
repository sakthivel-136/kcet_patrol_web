# app/utils/round_slots.py
# 12 rounds of 2 hours each — MUST match frontend roundtime.ts exactly:
#   1: 00:00–02:00, 2: 02:00–04:00, ... 12: 22:00–00:00 (next day)

from datetime import datetime, timedelta
import pytz

IST = pytz.timezone("Asia/Kolkata")

# 12 rounds: (round_number, start_hour, start_min, end_hour, end_min)
# Round 12 ends at 24:00 (midnight next day), handled below
ROUND_DEFINITIONS = [
    (1,  0,  0,  2,  0),
    (2,  2,  0,  4,  0),
    (3,  4,  0,  6,  0),
    (4,  6,  0,  8,  0),
    (5,  8,  0, 10,  0),
    (6, 10,  0, 12,  0),
    (7, 12,  0, 14,  0),
    (8, 14,  0, 16,  0),
    (9, 16,  0, 18,  0),
    (10, 18,  0, 20,  0),
    (11, 20,  0, 22,  0),
    (12, 22,  0,  0,  0),   # ends next day midnight
]


def generate_round_slots(report_date: str):
    """
    Returns list of (round_no, start_dt, end_dt) in IST.
    Matches the 12 rounds used by the frontend ROUND_TIMES.
    """
    base = datetime.strptime(report_date, "%Y-%m-%d")
    base = IST.localize(base)

    slots = []

    for (rno, sh, sm, eh, em) in ROUND_DEFINITIONS:
        start = base.replace(hour=sh, minute=sm, second=0, microsecond=0)

        if rno == 12:
            # Round 12 ends at midnight of the NEXT day
            end = (base + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        else:
            end = base.replace(hour=eh, minute=em, second=0, microsecond=0)

        slots.append((rno, start, end))

    return slots
