from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import time
from app.database import supabase
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
    result = supabase.table("shifts").select("*").execute()
    return result.data

@router.post("", status_code=status.HTTP_201_CREATED, response_model=ShiftResponse)
def create_shift(payload: ShiftCreate, _: dict = Depends(admin_only)):
    data = {
        "shift_name": payload.shift_name,
        "start_time": payload.start_time.isoformat(),
        "end_time": payload.end_time.isoformat()
    }
    result = supabase.table("shifts").insert(data).execute()
    created_shift = result.data[0]
    
    # Auto-assign all existing guards to this new shift
    guards_res = supabase.table("security_users").select("security_id").eq("role", "Guard").execute()
    guards = guards_res.data or []
    
    allocs = []
    for g in guards:
        allocs.append({
            "shift_id": created_shift["shift_id"],
            "security_id": g["security_id"],
            "allocation_date": "2099-12-31"
        })
        
    if allocs:
        supabase.table("shift_allocations").insert(allocs).execute()
        
    return created_shift

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shift(id: str, _: dict = Depends(admin_only)):
    supabase.table("shifts").delete().eq("shift_id", id).execute()
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
    
    result = supabase.table("shifts").update(data).eq("shift_id", id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Shift not found")
    return result.data[0]
