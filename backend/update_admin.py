import sys
import os
sys.path.append(r"E:\KCET Security rounds\kcet-security-rounds-server")

from app.database import supabase

# Update admin user to have ADMIN role
res = supabase.table("security_users").update({"role": "ADMIN"}).eq("security_id", "admin").execute()
print(res.data)
