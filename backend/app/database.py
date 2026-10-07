import os
import requests
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv(override=True)

CF_ACCOUNT = os.getenv("CLOUDFLARE_ACCOUNT_ID")
CF_DB = os.getenv("CLOUDFLARE_D1_ID")
CF_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")

class FakeRes:
    def __init__(self, data):
        self.data = data

class D1QueryBuilder:
    def __init__(self, table):
        self.table_name = table
        self.action = "SELECT"
        self._select = "*"
        self._insert_data = None
        self._update_data = None
        self._conditions = []
        self._order = None
        self._limit = None
        
    def select(self, cols="*"):
        self.action = "SELECT"
        self._select = cols
        return self
        
    def insert(self, data):
        self.action = "INSERT"
        self._insert_data = data
        return self
        
    def update(self, data, returning=None):
        self.action = "UPDATE"
        self._update_data = data
        return self
        
    def delete(self):
        self.action = "DELETE"
        return self
        
    def eq(self, col, val):
        self._conditions.append((f"{col} = ?", val))
        return self
        
    def gte(self, col, val):
        self._conditions.append((f"{col} >= ?", val))
        return self
        
    def lte(self, col, val):
        self._conditions.append((f"{col} <= ?", val))
        return self
        
        
    def order(self, col, ascending=True):
        self._order = f"{col} {'ASC' if ascending else 'DESC'}"
        return self
        
    def limit(self, count):
        self._limit = count
        return self

        
    def execute(self):
        sql = ""
        params = []
        
        if self.action == "SELECT":
            sql = f"SELECT {self._select} FROM {self.table_name}"
        elif self.action == "INSERT":
            if isinstance(self._insert_data, list):
                if len(self._insert_data) == 0:
                    return FakeRes([])
                cols = ", ".join(self._insert_data[0].keys())
                placeholders = ", ".join(["?"] * len(self._insert_data[0]))
                
                # Batch inserts in D1 HTTP API via multiple queries
                url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT}/d1/database/{CF_DB}/query"
                headers = {"Authorization": f"Bearer {CF_TOKEN}", "Content-Type": "application/json"}
                
                payload = []
                for row in self._insert_data:
                    q = f"INSERT INTO {self.table_name} ({cols}) VALUES ({placeholders}) RETURNING *"
                    payload.append({"sql": q, "params": list(row.values())})
                
                # Cloudflare D1 requires sequential requests or batch. Let's do sequential for simplicity as we don't have large inserts often.
                # Actually, D1 REST API doesn't support batching multiple SQL objects in one POST if it fails like before?
                # Oh wait, we can just use multiple HTTP requests or build a large SQL.
                # For shift allocations, it's small.
                all_res = []
                for p in payload:
                    r = requests.post(url, headers=headers, json=p)
                    data = r.json()
                    if data.get("success") and data["result"][0].get("results"):
                        all_res.extend(data["result"][0]["results"])
                return FakeRes(all_res)
                
            else:
                cols = ", ".join(self._insert_data.keys())
                placeholders = ", ".join(["?"] * len(self._insert_data))
                sql = f"INSERT INTO {self.table_name} ({cols}) VALUES ({placeholders}) RETURNING *"
                params = list(self._insert_data.values())
        elif self.action == "UPDATE":
            sets = ", ".join([f"{k} = ?" for k in self._update_data.keys()])
            sql = f"UPDATE {self.table_name} SET {sets}"
            params = list(self._update_data.values())
        elif self.action == "DELETE":
            sql = f"DELETE FROM {self.table_name}"
            
        if self.action in ["SELECT", "UPDATE", "DELETE"] and self._conditions:
            conds = " AND ".join([c[0] for c in self._conditions])
            sql += f" WHERE {conds}"
            params.extend([c[1] for c in self._conditions])
            
        if self.action in ["UPDATE", "DELETE"]:
            sql += " RETURNING *"
            

        if self.action == "SELECT" and self._order:
            sql += f" ORDER BY {self._order}"
            
        if self.action == "SELECT" and getattr(self, "_limit", None):
            sql += f" LIMIT {self._limit}"

            
        url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT}/d1/database/{CF_DB}/query"
        headers = {"Authorization": f"Bearer {CF_TOKEN}", "Content-Type": "application/json"}
        payload = {"sql": sql}
        if params:
            # D1 requires boolean to be integers, but python requests json does true/false -> SQLite doesn't natively support bools in standard bindings sometimes, but D1 handles JSON boolean correctly or we cast.
            payload["params"] = [1 if isinstance(p, bool) and p else (0 if isinstance(p, bool) and not p else p) for p in params]
        
        r = requests.post(url, headers=headers, json=payload)
        data = r.json()
        
        if not data.get("success"):
            print("D1 ERROR:", data)
            raise Exception("D1 Error: " + str(data))
            
        results = data["result"][0].get("results", [])
        return FakeRes(results)

class D1Client:
    def table(self, name):
        return D1QueryBuilder(name)

supabase = D1Client()

def get_db():
    return supabase

SCANNING_TABLE = "scanning_details"
QR_TABLE = "qr"

def insert_row(table: str, data: Dict[str, Any]) -> Dict:
    res = supabase.table(table).insert(data).execute()
    return res.data[0] if res.data else {}

def select_rows(table: str, filters: Optional[Dict[str, Any]] = None) -> List[Dict]:
    q = supabase.table(table).select("*")
    if filters:
        for k, v in filters.items():
            q = q.eq(k, v)
    res = q.execute()
    return res.data

def update_row(table: str, filters: Dict[str, Any], data: Dict[str, Any]) -> Dict:
    q = supabase.table(table).update(data)
    for k, v in filters.items():
        q = q.eq(k, v)
    res = q.execute()
    return res.data[0] if res.data else {}

def delete_row(table: str, filters: Dict[str, Any]) -> bool:
    q = supabase.table(table).delete()
    for k, v in filters.items():
        q = q.eq(k, v)
    res = q.execute()
    return True

def create_scan_log(data: Dict[str, Any]) -> Dict:
    return insert_row(SCANNING_TABLE, data)

def get_all_scan_logs() -> List[Dict]:
    return select_rows(SCANNING_TABLE)

def get_scan_logs_by_campus(campus_code: str) -> List[Dict]:
    return select_rows(SCANNING_TABLE, {"campus_code": campus_code})

def get_scan_logs_by_guard(guard_name: str) -> List[Dict]:
    return select_rows(SCANNING_TABLE, {"guard_name": guard_name})

def delete_scan_log(scan_id: int) -> bool:
    return delete_row(SCANNING_TABLE, {"id": scan_id})

def create_qr(data: Dict[str, Any]) -> Dict:
    if "waiting_time" not in data or data["waiting_time"] is None:
        data["waiting_time"] = 15
    return insert_row(QR_TABLE, data)

def get_qrs(filters: Optional[Dict[str, Any]] = None) -> List[Dict]:
    return select_rows(QR_TABLE, filters)

def get_qr_by_id(qr_id: int) -> Optional[Dict]:
    rows = select_rows(QR_TABLE, {"qr_id": qr_id})
    return rows[0] if rows else None

def update_qr(qr_id: int, data: Dict[str, Any]) -> Dict:
    if "waiting_time" in data and data["waiting_time"] is None:
        data["waiting_time"] = 15
    return update_row(QR_TABLE, {"qr_id": qr_id}, data)

def delete_qr(qr_id: int) -> bool:
    return delete_row(QR_TABLE, {"qr_id": qr_id})
