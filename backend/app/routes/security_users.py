from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
from app.database import supabase
from app.dependencies import get_current_user, admin_only


# -----------------------------
# Schemas
# -----------------------------

class SecurityUserBase(BaseModel):
    security_id: str = Field(..., description="Unique Security ID")
    security_name: str = Field(..., description="Name of the security user")
    factory: str = Field(..., description="Factory ID or Name")
    role: str = Field("Guard", description="Role of the security user")


class SecurityUserCreate(SecurityUserBase):
    security_password: str = Field(..., description="Password (plain text)")


class SecurityUserUpdate(BaseModel):
    security_name: Optional[str] = None
    security_password: Optional[str] = None
    factory: Optional[str] = None
    role: Optional[str] = None


class SecurityUserResponse(SecurityUserBase):
    security_password: str   # Plain password
    created_at: Optional[str] = None


# -----------------------------
# Router
# -----------------------------

router = APIRouter(
    prefix="/security-users",
    tags=["Security Users"]
)


# -----------------------------
# GET all users
# -----------------------------

@router.get("", response_model=List[SecurityUserResponse])
def get_security_users(_: dict = Depends(get_current_user)):

    result = supabase.table("security_users") \
        .select("*") \
        .execute()

    return result.data


# -----------------------------
# GET single user
# -----------------------------

@router.get("/{security_id}", response_model=SecurityUserResponse)
def get_security_user(security_id: str, _: dict = Depends(get_current_user)):

    result = supabase.table("security_users") \
        .select("*") \
        .eq("security_id", security_id) \
        .execute()

    if not result.data:
        raise HTTPException(404, "Security user not found")

    return result.data[0]


# -----------------------------
# CREATE user (NO HASH)
# -----------------------------

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=SecurityUserResponse
)
def create_security_user(payload: SecurityUserCreate, _: dict = Depends(admin_only)):

    # Check duplicate ID
    existing = supabase.table("security_users") \
        .select("*") \
        .eq("security_id", payload.security_id) \
        .execute()

    if existing.data:
        raise HTTPException(400, "Security ID already exists")

    data = {
        "security_id": payload.security_id,
        "security_name": payload.security_name,
        "security_password": payload.security_password,  # Plain PIN
        "factory": payload.factory,
        "role": payload.role
    }

    try:
        result = supabase.table("security_users") \
            .insert(data) \
            .execute()
        return result.data[0]
    except Exception as e:
        err_msg = str(e)
        if "23505" in err_msg or "already exists" in err_msg:
            raise HTTPException(400, "Security ID already exists")
        raise HTTPException(500, f"Database error: {err_msg}")


# -----------------------------
# UPDATE user (NO HASH)
# -----------------------------

@router.put("/{security_id}", response_model=SecurityUserResponse)
def update_security_user(security_id: str, payload: SecurityUserUpdate, _: dict = Depends(admin_only)):

    # Check exists
    existing = supabase.table("security_users") \
        .select("*") \
        .eq("security_id", security_id) \
        .execute()

    if not existing.data:
        raise HTTPException(404, "Security user not found")

    update_data = payload.dict(
        exclude_unset=True,
        exclude_none=True
    )

    result = supabase.table("security_users") \
        .update(update_data) \
        .eq("security_id", security_id) \
        .execute()

    return result.data[0]


# -----------------------------
# DELETE user
# -----------------------------

@router.delete("/{security_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_security_user(security_id: str, _: dict = Depends(admin_only)):

    existing = supabase.table("security_users") \
        .select("*") \
        .eq("security_id", security_id) \
        .execute()

    if not existing.data:
        raise HTTPException(404, "Security user not found")

    supabase.table("security_users") \
        .delete() \
        .eq("security_id", security_id) \
        .execute()

    return
