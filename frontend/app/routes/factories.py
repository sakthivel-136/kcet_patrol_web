from fastapi import APIRouter, HTTPException, status
from app.database import supabase
from app.schemas.campus import CampusCreate, CampusResponse


router = APIRouter(
    prefix="/campuses",
    tags=["Campuses"]
)


# ---------------------------
# CREATE Campus
# ---------------------------
@router.post("", status_code=status.HTTP_201_CREATED, response_model=CampusResponse)
def create_campus(payload: CampusCreate):

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
def get_campuses():

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
def get_campuses_minimal():

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
def get_campus(campus_code: str):

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
def update_campus(campus_code: str, payload: CampusCreate):

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
def delete_campus(campus_code: str):

    existing = supabase.table("campuses") \
        .select("*") \
        .eq("campus_code", campus_code) \
        .execute()

    if not existing.data:
        raise HTTPException(404, "Campus not found")

    supabase.table("campuses") \
        .delete() \
        .eq("campus_code", campus_code) \
        .execute()

    return {"message": "Campus deleted successfully"}
