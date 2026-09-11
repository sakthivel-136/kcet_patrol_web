from datetime import datetime
import pytz

IST = pytz.timezone("Asia/Kolkata")
raw = "2026-08-19T14:39:56.452373+05:30"
try:
    dt = datetime.fromisoformat(raw.replace("Z", "+00:00"))
    if dt.tzinfo is None:
        dt = IST.localize(dt)
    else:
        dt = dt.astimezone(IST)
    print("SUCCESS", dt)
except Exception as e:
    print("FAILED", e)
