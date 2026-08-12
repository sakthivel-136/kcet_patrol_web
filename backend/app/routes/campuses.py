from fastapi import APIRouter, HTTPException, status, Depends
from app.database import supabase
from app.schemas.campus import CampusCreate, CampusResponse
from app.dependencies import get_current_user, admin_only

router = APIRouter(
    prefix="/campuses",
    tags=["Campuses"]
)


# ---------------------------
# CREATE Campus
# ---------------------------
@router.post("", status_code=status.HTTP_201_CREATED, response_model=CampusResponse)
def create_campus(payload: CampusCreate, _: dict = Depends(admin_only)):

    result = supabase.table("campuses").insert({

        "campus_code": payload.campus_code,
        "campus_name": payload.campus_name,

        # ✅ SAVE LOCATION
        "location": payload.location,

        # ✅ SAVE REAL ADDRESS (IMPORTANT)
        "campus_address": payload.campus_address,

        "is_active": True

    }).execute()

    if not result.data:
        raise HTTPException(500, "Failed to create campus")

    return result.data[0]


# ---------------------------
# GET ALL Campuses
# ---------------------------
@router.get("", response_model=list[CampusResponse])
def get_campuses(_: dict = Depends(get_current_user)):

    result = (
        supabase
        .table("campuses")
        .select("*")
        .execute()
    )

    return result.data or []


# ---------------------------
# GET Minimal (Dropdown)
# ---------------------------
@router.get("/minimal")
def get_campuses_minimal(_: dict = Depends(get_current_user)):

    result = (
        supabase
        .table("campuses")
        .select("campus_code, campus_name, campus_address")
        .execute()
    )

    return result.data or []


# ---------------------------
# GET Single Campus
# ---------------------------
@router.get("/{campus_code}", response_model=CampusResponse)
def get_campus(campus_code: str, _: dict = Depends(get_current_user)):

    result = (
        supabase
        .table("campuses")
        .select("*")
        .eq("campus_code", campus_code)
        .execute()
    )

    if not result.data:
        raise HTTPException(404, "Campus not found")

    return result.data[0]


# ---------------------------
# UPDATE Campus
# ---------------------------
@router.put("/{campus_code}", response_model=CampusResponse)
def update_campus(campus_code: str, payload: CampusCreate, _: dict = Depends(admin_only)):

    existing = supabase.table("campuses") \
        .select("*") \
        .eq("campus_code", campus_code) \
        .execute()

    if not existing.data:
        raise HTTPException(404, "Campus not found")

    result = supabase.table("campuses").update({

        "campus_name": payload.campus_name,

        # ✅ UPDATE LOCATION
        "location": payload.location,

        # ✅ UPDATE REAL ADDRESS
        "campus_address": payload.campus_address,

    }).eq("campus_code", campus_code).execute()

    if not result.data:
        raise HTTPException(500, "Failed to update campus")

    return result.data[0]


# ---------------------------
# DELETE Campus
# ---------------------------
@router.delete("/{campus_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campus(campus_code: str, _: dict = Depends(admin_only)):

    existing = supabase.table("campuses") \
        .select("*") \
        .eq("campus_code", campus_code) \
        .execute()

    if not existing.data:
        raise HTTPException(404, "Campus not found")

    # 1. Delete associated scan points (references campus_code in campus_code field)
    supabase.table("scan_points") \
        .delete() \
        .eq("campus_code", campus_code) \
        .execute()

    # 2. Delete associated QR codes (references campus_code in campus_code field)
    supabase.table("qr") \
        .delete() \
        .eq("campus_code", campus_code) \
        .execute()

    # 3. Delete the campus itself
    supabase.table("campuses") \
        .delete() \
        .eq("campus_code", campus_code) \
        .execute()

    return None
