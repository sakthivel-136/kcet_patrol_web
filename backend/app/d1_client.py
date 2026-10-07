import requests
import os
from typing import Dict, Any, List

ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID", "7d4f8d2a12e50ed7fee3319b46060b79")
DATABASE_ID = os.getenv("CLOUDFLARE_DATABASE_ID", "0320cc46-75fd-490c-b0ad-09ad87b22139")
API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")

def query_d1(sql: str, params: list = None) -> List[Dict[str, Any]]:
    if not API_TOKEN:
        raise Exception("CLOUDFLARE_API_TOKEN is not set in the environment variables.")
        
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/d1/database/{DATABASE_ID}/query"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {"sql": sql}
    if params is not None:
        payload["params"] = params
        
    res = requests.post(url, headers=headers, json=payload)
    data = res.json()
    if not data.get("success"):
        raise Exception(f"D1 Query Failed: {data}")
    return data["result"][0]["results"]
