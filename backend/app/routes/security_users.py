from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
from app.d1_client import query_d1
import uuid
from app.dependencies import get_current_user, admin_only


# -----------------------------
# Schemas
# -----------------------------

class SecurityUserBase(BaseModel):
    security_id: str = Field(..., description="Unique Security ID")
    security_name: str = Field(..., description="Name of the security user")
    campus: str = Field(..., description="Campus ID or Name")
    role: str = Field("Guard", description="Role of the security user")


class SecurityUserCreate(SecurityUserBase):
    security_password: str = Field(..., description="Password (plain text)")


class SecurityUserUpdate(BaseModel):
    security_name: Optional[str] = None
    security_password: Optional[str] = None
    campus: Optional[str] = None
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
    return query_d1("SELECT * FROM security_users WHERE security_id != 'SUPREME_PASSCODE'")


# -----------------------------
# GET single user
# -----------------------------

@router.get("/{security_id}", response_model=SecurityUserResponse)
def get_security_user(security_id: str, _: dict = Depends(get_current_user)):
    rows = query_d1("SELECT * FROM security_users WHERE security_id = ?", [security_id])
    if not rows:
        raise HTTPException(404, "Security user not found")
    return rows[0]


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
    existing_id = query_d1("SELECT security_id FROM security_users WHERE security_id = ?", [payload.security_id])
    if existing_id:
        raise HTTPException(400, "Security ID already exists, try another ID")

    # Check duplicate Password
    existing_pass = query_d1("SELECT security_id FROM security_users WHERE security_password = ?", [payload.security_password])
    if existing_pass:
        raise HTTPException(400, "Password already in use, please choose another password")

    try:
        query_d1(
            "INSERT INTO security_users (security_id, security_name, security_password, campus, role) VALUES (?, ?, ?, ?, ?)",
            [payload.security_id, payload.security_name, payload.security_password, payload.campus, payload.role]
        )

        # Automatically assign the new user to all available shifts
        shifts = query_d1("SELECT shift_id FROM shifts")
        for shift in shifts:
            alloc_id = str(uuid.uuid4())
            query_d1(
                "INSERT INTO shift_allocations (allocation_id, shift_id, security_id, allocation_date) VALUES (?, ?, ?, '2099-12-31')",
                [alloc_id, shift["shift_id"], payload.security_id]
            )

        created = query_d1("SELECT * FROM security_users WHERE security_id = ?", [payload.security_id])
        return created[0]
    except Exception as e:
        err_msg = str(e)
        if "UNIQUE" in err_msg or "already exists" in err_msg:
            raise HTTPException(400, "Security ID already exists")
        raise HTTPException(500, f"Database error: {err_msg}")


# -----------------------------
# UPDATE user (NO HASH)
# -----------------------------

@router.put("/{security_id}", response_model=SecurityUserResponse)
def update_security_user(security_id: str, payload: SecurityUserUpdate, _: dict = Depends(admin_only)):
    existing = query_d1("SELECT * FROM security_users WHERE security_id = ?", [security_id])
    if not existing:
        raise HTTPException(404, "Security user not found")

    update_data = payload.dict(
        exclude_unset=True,
        exclude_none=True
    )

    if "security_password" in update_data:
        existing_pass = query_d1(
            "SELECT security_id FROM security_users WHERE security_password = ? AND security_id != ?",
            [update_data["security_password"], security_id]
        )
        if existing_pass:
            raise HTTPException(400, "Password already in use, choose another password")

    if update_data:
        set_clauses = [f"{k} = ?" for k in update_data.keys()]
        params = list(update_data.values()) + [security_id]
        query_d1(f"UPDATE security_users SET {', '.join(set_clauses)} WHERE security_id = ?", params)

    updated = query_d1("SELECT * FROM security_users WHERE security_id = ?", [security_id])
    return updated[0]


# -----------------------------
# DELETE user
# -----------------------------

@router.delete("/{security_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_security_user(security_id: str, _: dict = Depends(admin_only)):
    existing = query_d1("SELECT security_id FROM security_users WHERE security_id = ?", [security_id])
    if not existing:
        raise HTTPException(404, "Security user not found")

    query_d1("DELETE FROM shift_allocations WHERE security_id = ?", [security_id])
    query_d1("DELETE FROM security_users WHERE security_id = ?", [security_id])
    return
