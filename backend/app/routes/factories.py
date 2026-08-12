from fastapi import APIRouter, HTTPException, status, Depends
from app.database import supabase
from app.schemas.factory import FactoryCreate, FactoryResponse
from app.dependencies import get_current_user, admin_only

router = APIRouter(
    prefix="/factories",
    tags=["Factories"]
)


# ---------------------------
# CREATE Factory
# ---------------------------
@router.post("", status_code=status.HTTP_201_CREATED, response_model=FactoryResponse)
def create_factory(payload: FactoryCreate, _: dict = Depends(admin_only)):

    result = supabase.table("factories").insert({

        "factory_code": payload.factory_code,
        "factory_name": payload.factory_name,

        # ✅ SAVE LOCATION
        "location": payload.location,

        # ✅ SAVE REAL ADDRESS (IMPORTANT)
        "factory_address": payload.factory_address,

        "is_active": True

    }).execute()

    if not result.data:
        raise HTTPException(500, "Failed to create factory")

    return result.data[0]


# ---------------------------
# GET ALL Factories
# ---------------------------
@router.get("", response_model=list[FactoryResponse])
def get_factories(_: dict = Depends(get_current_user)):

    result = (
        supabase
        .table("factories")
        .select("*")
        .execute()
    )

    return result.data or []


# ---------------------------
# GET Minimal (Dropdown)
# ---------------------------
@router.get("/minimal")
def get_factories_minimal(_: dict = Depends(get_current_user)):

    result = (
        supabase
        .table("factories")
        .select("factory_code, factory_name, factory_address")
        .execute()
    )

    return result.data or []


# ---------------------------
# GET Single Factory
# ---------------------------
@router.get("/{factory_code}", response_model=FactoryResponse)
def get_factory(factory_code: str, _: dict = Depends(get_current_user)):

    result = (
        supabase
        .table("factories")
        .select("*")
        .eq("factory_code", factory_code)
        .execute()
    )

    if not result.data:
        raise HTTPException(404, "Factory not found")

    return result.data[0]


# ---------------------------
# UPDATE Factory
# ---------------------------
@router.put("/{factory_code}", response_model=FactoryResponse)
def update_factory(factory_code: str, payload: FactoryCreate, _: dict = Depends(admin_only)):

    existing = supabase.table("factories") \
        .select("*") \
        .eq("factory_code", factory_code) \
        .execute()

    if not existing.data:
        raise HTTPException(404, "Factory not found")

    result = supabase.table("factories").update({

        "factory_name": payload.factory_name,

        # ✅ UPDATE LOCATION
        "location": payload.location,

        # ✅ UPDATE REAL ADDRESS
        "factory_address": payload.factory_address,

    }).eq("factory_code", factory_code).execute()

    if not result.data:
        raise HTTPException(500, "Failed to update factory")

    return result.data[0]


# ---------------------------
# DELETE Factory
# ---------------------------
@router.delete("/{factory_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_factory(factory_code: str, _: dict = Depends(admin_only)):

    existing = supabase.table("factories") \
        .select("*") \
        .eq("factory_code", factory_code) \
        .execute()

    if not existing.data:
        raise HTTPException(404, "Factory not found")

    # 1. Delete associated scan points (references factory_code in factory_id field)
    supabase.table("scan_points") \
        .delete() \
        .eq("factory_id", factory_code) \
        .execute()

    # 2. Delete associated QR codes (references factory_code in factory_code field)
    supabase.table("qr") \
        .delete() \
        .eq("factory_code", factory_code) \
        .execute()

    # 3. Delete the factory itself
    supabase.table("factories") \
        .delete() \
        .eq("factory_code", factory_code) \
        .execute()

    return None
