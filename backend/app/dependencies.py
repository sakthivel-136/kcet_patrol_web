from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.config import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        role = payload.get("role")
        if user_id is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, "role": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def admin_only(user: dict = Depends(get_current_user)):
    if str(user.get("role", "")).upper() != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admin allowed")
    return user

def supervisor_or_admin(user: dict = Depends(get_current_user)):
    role = str(user.get("role", "")).upper()
    if role not in ["ADMIN", "SUPERVISOR"]:
        raise HTTPException(status_code=403, detail="Only supervisor or admin allowed")
    return user

