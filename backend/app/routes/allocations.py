from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.database import supabase
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
    query = supabase.table("shift_allocations").select("allocation_id, shift_id, security_id")
    if shift_id:
        query = query.eq("shift_id", shift_id)
    
    # Only get permanent roster
    query = query.eq("allocation_date", "2099-12-31")
    result = query.execute()
    
    # Map DB column names to API response
    mapped = []
    for r in result.data:
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
            supabase.table("shift_allocations").delete().eq("shift_id", shift_id).eq("allocation_date", "2099-12-31").execute()
            
            # Insert new permanent allocations
            data = [
                {
                    "shift_id": a.shift_id,
                    "security_id": a.guard_id,
                    "allocation_date": "2099-12-31"
                }
                for a in allocations
            ]
            result = supabase.table("shift_allocations").insert(data).execute()
            
            return {"message": "Success", "allocations_inserted": len(result.data)}
            
        return {"message": "No allocations provided", "allocations_inserted": 0}
    except Exception as e:
        raise HTTPException(500, f"Database error: {str(e)}")
