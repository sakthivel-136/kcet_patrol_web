from app.database import supabase

guards_data = [
    {"name": "A. Lakshmanan", "id": "1001", "pin": "2424"},
    {"name": "C. Srinivasan", "id": "1002", "pin": "3535"},
    {"name": "D. Rajan", "id": "1003", "pin": "4646"},
    {"name": "G. Shanmugavel (S.O)", "id": "1004", "pin": "5757"},
    {"name": "G. Nagarajan", "id": "1005", "pin": "6868"},
    {"name": "G. Ravi", "id": "1006", "pin": "7979"},
    {"name": "G. Ayran", "id": "1007", "pin": "1818"},
    {"name": "G. Ganeshan", "id": "1008", "pin": "2929"},
    {"name": "M. Abdhahir", "id": "1009", "pin": "3838"},
    {"name": "M. Thiruvadivel", "id": "1010", "pin": "4747"},
    {"name": "P. Nagarajan", "id": "1011", "pin": "5656"},
    {"name": "P. Sekar", "id": "1012", "pin": "6565"},
    {"name": "R. Rajapandi", "id": "1013", "pin": "7474"},
    {"name": "S. Ashokumar", "id": "1014", "pin": "8383"},
    {"name": "S. Mottaiappan", "id": "1015", "pin": "9292"},
    {"name": "S. Velthiuppathi", "id": "1016", "pin": "2727"},
    {"name": "S. Pitchai", "id": "1017", "pin": "3636"},
    {"name": "V. Balasubramanian", "id": "1018", "pin": "4545"}
]

def run():
    print("Fetching active shifts...")
    shifts_res = supabase.table("shifts").select("shift_id").execute()
    shifts = shifts_res.data or []
    
    for g in guards_data:
        print(f"Inserting guard: {g['name']} (ID: {g['id']})")
        # Check if exists
        existing = supabase.table("security_users").select("security_id").eq("security_id", g['id']).execute().data
        if not existing:
            # Insert User
            supabase.table("security_users").insert({
                "security_id": g['id'],
                "security_name": g['name'],
                "security_password": g['pin'],
                "campus": "KCET01",
                "role": "Guard"
            }).execute()
            
            # Assign to all shifts
            allocs = []
            for s in shifts:
                allocs.append({
                    "shift_id": s["shift_id"],
                    "security_id": g['id'],
                    "allocation_date": "2099-12-31"
                })
            if allocs:
                supabase.table("shift_allocations").insert(allocs).execute()
        else:
            print(f"  -> Guard {g['id']} already exists, skipping.")
            
    print("All guards processed!")

if __name__ == "__main__":
    run()
