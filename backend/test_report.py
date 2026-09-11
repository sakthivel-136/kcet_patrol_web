from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Bypass auth by overriding the dependency
from app.dependencies import get_current_user
app.dependency_overrides[get_current_user] = lambda: {"user": "test"}

response = client.get("/report/download?campus_code=KCET01&report_date=2026-09-09")
data = response.json()
qrs = set(d["qr_name"] for d in data)
print(f"Total QRs: {len(qrs)}")
for qr in qrs:
    print(qr)
