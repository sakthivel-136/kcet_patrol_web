from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.database import supabase
from app.d1_client import query_d1
import uuid
from app.dependencies import get_current_user, admin_only, supervisor_or_admin

class ShiftAllocationBase(BaseModel):
    shift_id: str
    guard_id: str

class ShiftAllocationCreate(ShiftAllocationBase):
    pass

class ShiftAllocationResponse(ShiftAllocationBase):
    id: str

router = APIRouter(
    prefix="/allocations",
    tags=["Shift Allocations"]
)

@router.get("", response_model=List[ShiftAllocationResponse])
def get_allocations(shift_id: Optional[str] = None, _: dict = Depends(get_current_user)):
    sql = "SELECT allocation_id, shift_id, security_id FROM shift_allocations WHERE allocation_date = '2099-12-31'"
    params = []
    if shift_id:
        sql += " AND shift_id = ?"
        params.append(shift_id)
        
    result = query_d1(sql, params)
    
    mapped = []
    for r in result:
        mapped.append({
            "id": r["allocation_id"],
            "shift_id": r["shift_id"],
            "guard_id": r["security_id"]
        })
    return mapped

@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def allocate_guards_bulk(allocations: List[ShiftAllocationCreate], _: dict = Depends(supervisor_or_admin)):
    try:
        if len(allocations) > 0:
            shift_id = allocations[0].shift_id
            
            # Delete old permanent allocations for this shift
            query_d1("DELETE FROM shift_allocations WHERE shift_id = ? AND allocation_date = '2099-12-31'", [shift_id])
            
            inserted = 0
            for a in allocations:
                if a.guard_id != "CLEAR":
                    query_d1(
                        "INSERT INTO shift_allocations (allocation_id, shift_id, security_id, allocation_date) VALUES (?, ?, ?, '2099-12-31')",
                        [str(uuid.uuid4()), a.shift_id, a.guard_id]
                    )
                    inserted += 1
            
            # Sync to security_users for mobile app support
            try:
                shift_res = query_d1("SELECT start_time, end_time FROM shifts WHERE shift_id = ?", [shift_id])
                if shift_res:
                    start_time = shift_res[0]["start_time"]
                    end_time = shift_res[0]["end_time"]
                    
                    for a in allocations:
                        if a.guard_id != "CLEAR":
                            query_d1(
                                "UPDATE security_users SET shift_start = ?, shift_end = ? WHERE security_id = ?",
                                [start_time[:5], end_time[:5], a.guard_id]
                            )
            except Exception as e:
                print(f"Warning: Failed to sync shift times to security_users: {e}")
            
            return {"message": "Success", "allocations_inserted": inserted}
            
        return {"message": "No allocations provided", "allocations_inserted": 0}
    except Exception as e:
        raise HTTPException(500, f"Database error: {str(e)}")
