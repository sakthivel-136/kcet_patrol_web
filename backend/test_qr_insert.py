from app.database import supabase
from datetime import datetime
import pytz

# Insert dummy QR for today
data = {
    "qr_id": 999,
    "qr_name": "TEST_QR_SEP11",
    "campus_code": "KCET01",
    "created_at": datetime.now(pytz.timezone("Asia/Kolkata")).isoformat()
}
supabase.table("qr").insert(data).execute()
