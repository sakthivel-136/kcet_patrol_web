import sys
import os
sys.path.append(r"E:\KCET Security rounds\kcet-security-rounds-server")

from app.database import supabase

# Seed Guards
guards_data = [
    {"security_id": f"{i:04d}", "security_name": name, "security_password": "password123", "role": "Guard", "campus": "KCET01"}
    for i, name in enumerate([
        "Adam", "Sathis", "Ravi", "Kumar", "Vijay", "Ajith", "Surya", "Vikram", "Dhanush", "Siva",
        "Karthi", "Jayam", "Vishal", "Arya", "Jiiva", "Simbu", "Madhavan", "Kamal", "Rajini", "Vijayakanth"
    ], 1)
]

# Insert Guards
for g in guards_data:
    try:
        supabase.table("security_users").insert(g).execute()
        print(f"Inserted guard {g['security_name']}")
    except Exception as e:
        print(f"Skipping guard {g['security_name']}: {str(e)}")

# Seed QRs
qr_names = [
    "Parking", "Temple", "Generator", "Transformer", "Mechanical Block", 
    "Boys Hostel", "Relavantz", "Canteen", "Ground", "Girls Hostel", 
    "Car Parking", "Garden", "Parents Paradise"
]

qr_data = [
    {
        "scan_point_name": name, 
        "scan_point_code": f"QR{i:02d}", 
        "campus_code": "KCET01", 
        "location": "0.0,0.0", 
        "scan_type": "QR", 
        "floor": "Ground", 
        "area": "Main", 
        "risk_level": "Low", 
        "is_active": True
    }
    for i, name in enumerate(qr_names, 1)
]

# Insert QRs
for q in qr_data:
    try:
        supabase.table("scan_points").insert(q).execute()
        print(f"Inserted QR {q['qr_name']}")
    except Exception as e:
        print(f"Skipping QR {q['qr_name']}: {str(e)}")

print("Done seeding data.")
