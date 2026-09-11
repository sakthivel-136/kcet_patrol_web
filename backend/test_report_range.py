from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

from app.dependencies import get_current_user
app.dependency_overrides[get_current_user] = lambda: {"user": "test"}

response = client.get("/report/download?campus_code=KCET01&report_date=2026-09-09&end_date=2026-09-11")
data = response.json()

qrs_by_date = {}
for d in data:
    dt = d["date"]
    if dt not in qrs_by_date:
        qrs_by_date[dt] = set()
    qrs_by_date[dt].add(d["qr_name"])

for dt, qrs in qrs_by_date.items():
    print(f"Date {dt} has {len(qrs)} QRs.")
    if "TEST_QR_SEP11" in qrs:
        print("  -> TEST_QR_SEP11 is present on", dt)
