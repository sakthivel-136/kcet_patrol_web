from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import time
from app.database import supabase
from app.dependencies import get_current_user, admin_only

class RoundBase(BaseModel):
    round_number: int
    start_time: time
    end_time: time

class RoundCreate(RoundBase):
    pass

class RoundResponse(RoundBase):
    id: str
    created_at: Optional[str] = None

router = APIRouter(
    prefix="/rounds",
    tags=["Rounds"]
)

@router.get("", response_model=List[RoundResponse])
def get_rounds(_: dict = Depends(get_current_user)):
    result = supabase.table("patrol_rounds").select("*").order("round_number").execute()
    return result.data

@router.post("", status_code=status.HTTP_201_CREATED, response_model=RoundResponse)
def create_round(payload: RoundCreate, _: dict = Depends(admin_only)):
    data = {
        "round_number": payload.round_number,
        "start_time": payload.start_time.isoformat(),
        "end_time": payload.end_time.isoformat()
    }
    result = supabase.table("patrol_rounds").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Could not create round")
    return result.data[0]

@router.put("/{round_id}", response_model=RoundResponse)
def update_round(round_id: str, payload: RoundBase, _: dict = Depends(admin_only)):
    data = {
        "round_number": payload.round_number,
        "start_time": payload.start_time.isoformat(),
        "end_time": payload.end_time.isoformat()
    }
    result = supabase.table("patrol_rounds").update(data).eq("id", round_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Round not found")
    return result.data[0]

@router.delete("/{round_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_round(round_id: str, _: dict = Depends(admin_only)):
    result = supabase.table("patrol_rounds").delete().eq("id", round_id).execute()
    return None
