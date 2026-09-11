from app.database import supabase
try:
    supabase.table("security_users").insert({
        "security_id": "SUPREME_PASSCODE",
        "security_name": "System Setting - Supreme Passcode",
        "security_password": "KCET@1998",
        "campus": "KCET01",
        "role": "SYSTEM_SETTING"
    }).execute()
    print("Supreme Passcode stored in DB successfully.")
except Exception as e:
    if "23505" in str(e) or "already exists" in str(e):
        print("Supreme Passcode already in DB.")
        # Ensure it's correct
        supabase.table("security_users").update({
            "security_password": "KCET@1998"
        }).eq("security_id", "SUPREME_PASSCODE").execute()
    else:
        print("Error:", e)
