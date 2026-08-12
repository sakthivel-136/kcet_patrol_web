# app/routes/auth.py

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from datetime import timedelta

from app.core.security import create_access_token
from app.database import get_db


router = APIRouter(prefix="/auth", tags=["Authentication"])


# ----------------------
# Request Schema
# ----------------------
class LoginRequest(BaseModel):
    user_id: str
    user_pin: str


# ----------------------
# Login Route (DB BASED)
# ----------------------
@router.post("/login")
async def login(
    payload: LoginRequest,
    db=Depends(get_db)
):

    try:

        # ==============================
        # 1. Fetch user from DB
        # ==============================
        res = (
            db.table("security_users")
            .select("security_id, security_password, security_name, campus, role")
            .eq("security_id", payload.user_id)
            .limit(1)
            .execute()
        )

        users = res.data or []

        if not users:
            raise HTTPException(
                status_code=401,
                detail="Invalid User ID or Password"
            )

        user = users[0]

        # ==============================
        # 2. Verify PIN
        # ==============================
        if user["security_password"] != payload.user_pin:
            raise HTTPException(
                status_code=401,
                detail="Invalid User ID or Password"
            )


        # ==============================
        # 3. Create Token
        # ==============================
        access_token = create_access_token(
            {
                "user_id": user["security_id"],
                "role": user.get("role", "Guard"),
            },
            expires_delta=timedelta(minutes=60)
        )


        # ==============================
        # 4. Return Response
        # ==============================
        return JSONResponse(
            content={
                "access_token": access_token,
                "token_type": "bearer",
                "role": user.get("role", "Guard"),
                "name": user["security_name"],   # ✅ REAL NAME
            }
        )


    except HTTPException:
        raise


    except Exception as e:

        print("LOGIN ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Login failed"
        )
