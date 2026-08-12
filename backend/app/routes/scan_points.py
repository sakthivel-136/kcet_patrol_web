from fastapi import APIRouter, HTTPException, status, Query, Depends
from app.database import supabase
from app.schemas.scan_point import ScanPointCreate, ScanPointUpdate, ScanPointResponse
from app.dependencies import get_current_user, admin_only

router = APIRouter(
    prefix="/scan-points",
    tags=["Scan Points"]
)

# ---------------------------
# CREATE scan point
# ---------------------------
@router.post("", status_code=status.HTTP_201_CREATED, response_model=ScanPointResponse)
def create_scan_point(payload: ScanPointCreate, _: dict = Depends(admin_only)):
    # Check if campus exists
    campus = supabase.table("campuses").select("campus_code").eq("campus_code", payload.campus_code).execute()
    if not campus.data:
        raise HTTPException(status_code=404, detail="Campus not found")

    # Check duplicate name
    existing = supabase.table("scan_points").select("*").eq("scan_point_name", payload.scan_point_name).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Scan Point with this name already exists")

    insert_data = {
        "campus_code": payload.campus_code,
        "scan_point_name": payload.scan_point_name,
        "scan_point_code": payload.scan_point_code or payload.scan_point_name,
        "location": payload.location,
        "scan_type": payload.scan_type,
        "floor": payload.floor,
        "area": payload.area,
        "risk_level": payload.risk_level,
        "is_active": True
    }

    result = supabase.table("scan_points").insert(insert_data).select("*").execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create scan point")

    return result.data[0]

# ---------------------------
# GET all scan points (optionally filter by campus)
# ---------------------------
@router.get("", response_model=list[ScanPointResponse])
def get_scan_points(campus_code: str = Query(None, description="Filter by Campus ID"), _: dict = Depends(get_current_user)):
    query = supabase.table("scan_points").select("*")
    if campus_code:
        query = query.eq("campus_code", campus_code)
    result = query.execute()
    return result.data or []

# ---------------------------
# GET scan point by ID
# ---------------------------
@router.get("/{scan_point_id}", response_model=ScanPointResponse)
def get_scan_point(scan_point_id: str, _: dict = Depends(get_current_user)):
    result = supabase.table("scan_points").select("*").eq("id", scan_point_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Scan Point not found")
    return result.data[0]

# ---------------------------
# UPDATE scan point
# ---------------------------
@router.put("/{scan_point_id}", response_model=ScanPointResponse)
def update_scan_point(scan_point_id: str, payload: ScanPointUpdate, _: dict = Depends(admin_only)):
    existing = supabase.table("scan_points").select("*").eq("id", scan_point_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Scan Point not found")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    # ✅ Fixed: use returning='representation'
    result = supabase.table("scan_points").update(update_data, returning="representation").eq("id", scan_point_id).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to update scan point")

    return result.data[0]

# ---------------------------
# DELETE scan point
# ---------------------------
@router.delete("/{scan_point_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scan_point(scan_point_id: str, _: dict = Depends(admin_only)):
    existing = supabase.table("scan_points").select("*").eq("id", scan_point_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Scan Point not found")

    supabase.table("scan_points").delete().eq("id", scan_point_id).execute()
    return None
