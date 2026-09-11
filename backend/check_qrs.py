from app.database import supabase
qrs = supabase.table("qr").select("qr_id, qr_name, created_at").execute().data
for q in qrs:
    print(q)
