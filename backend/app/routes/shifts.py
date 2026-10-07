from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import time
from app.database import supabase
from app.d1_client import query_d1
import uuid
from app.dependencies import get_current_user, admin_only

class ShiftBase(BaseModel):
    shift_name: str
    start_time: time
    end_time: time

class ShiftCreate(ShiftBase):
    pass

class ShiftResponse(ShiftBase):
    shift_id: str
    created_at: Optional[str] = None

router = APIRouter(
    prefix="/shifts",
    tags=["Shifts"]
)

@router.get("", response_model=List[ShiftResponse])
def get_shifts(_: dict = Depends(get_current_user)):
    results = query_d1("SELECT * FROM shifts")
    return results

@router.post("", status_code=status.HTTP_201_CREATED, response_model=ShiftResponse)
def create_shift(payload: ShiftCreate, _: dict = Depends(admin_only)):
    shift_id = str(uuid.uuid4())
    query_d1(
        "INSERT INTO shifts (shift_id, shift_name, start_time, end_time) VALUES (?, ?, ?, ?)",
        [shift_id, payload.shift_name, payload.start_time.isoformat(), payload.end_time.isoformat()]
    )
    
    # Auto-assign all existing guards to this new shift
    guards = query_d1("SELECT security_id FROM security_users WHERE role = 'Guard'")
    
    for g in guards:
        query_d1(
            "INSERT INTO shift_allocations (shift_id, security_id, allocation_date) VALUES (?, ?, '2099-12-31')",
            [shift_id, g["security_id"]]
        )
        
    created = query_d1("SELECT * FROM shifts WHERE shift_id = ?", [shift_id])
    return created[0]

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shift(id: str, _: dict = Depends(admin_only)):
    query_d1("DELETE FROM shifts WHERE shift_id = ?", [id])
    return

class ShiftUpdate(BaseModel):
    shift_name: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None

@router.put("/{id}", response_model=ShiftResponse)
def update_shift(id: str, payload: ShiftUpdate, _: dict = Depends(admin_only)):
    data = payload.model_dump(exclude_unset=True)
    if "start_time" in data:
        data["start_time"] = data["start_time"].isoformat()
    if "end_time" in data:
        data["end_time"] = data["end_time"].isoformat()
    
    for k, v in data.items():
        query_d1(f"UPDATE shifts SET {k} = ? WHERE shift_id = ?", [v, id])
        
    updated = query_d1("SELECT * FROM shifts WHERE shift_id = ?", [id])
    if not updated:
        raise HTTPException(status_code=404, detail="Shift not found")
    return updated[0]
