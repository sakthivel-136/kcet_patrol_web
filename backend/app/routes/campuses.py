from fastapi import APIRouter, HTTPException, status, Depends
from app.d1_client import query_d1
from app.schemas.campus import CampusCreate, CampusResponse
from app.dependencies import get_current_user, admin_only

router = APIRouter(
    prefix="/campuses",
    tags=["Campuses"]
)

# ---------------------------
# CREATE Campus
# ---------------------------
@router.post("", status_code=status.HTTP_201_CREATED, response_model=CampusResponse)
def create_campus(payload: CampusCreate, _: dict = Depends(admin_only)):
    query_d1(
        "INSERT INTO campuses (campus_code, campus_name, location, campus_address, is_active) VALUES (?, ?, ?, ?, ?)",
        [payload.campus_code, payload.campus_name, payload.location, payload.campus_address, 1]
    )
    rows = query_d1("SELECT * FROM campuses WHERE campus_code = ?", [payload.campus_code])
    if not rows:
        raise HTTPException(500, "Failed to create campus")
    return rows[0]

# ---------------------------
# GET ALL Campuses
# ---------------------------
@router.get("", response_model=list[CampusResponse])
def get_campuses(_: dict = Depends(get_current_user)):
    return query_d1("SELECT * FROM campuses")

# ---------------------------
# GET Minimal (Dropdown)
# ---------------------------
@router.get("/minimal")
def get_campuses_minimal(_: dict = Depends(get_current_user)):
    return query_d1("SELECT campus_code, campus_name, campus_address FROM campuses")

# ---------------------------
# GET Single Campus
# ---------------------------
@router.get("/{campus_code}", response_model=CampusResponse)
def get_campus(campus_code: str, _: dict = Depends(get_current_user)):
    rows = query_d1("SELECT * FROM campuses WHERE campus_code = ?", [campus_code])
    if not rows:
        raise HTTPException(404, "Campus not found")
    return rows[0]

# ---------------------------
# UPDATE Campus
# ---------------------------
@router.put("/{campus_code}", response_model=CampusResponse)
def update_campus(campus_code: str, payload: CampusCreate, _: dict = Depends(admin_only)):
    existing = query_d1("SELECT * FROM campuses WHERE campus_code = ?", [campus_code])
    if not existing:
        raise HTTPException(404, "Campus not found")

    query_d1(
        "UPDATE campuses SET campus_name = ?, location = ?, campus_address = ? WHERE campus_code = ?",
        [payload.campus_name, payload.location, payload.campus_address, campus_code]
    )
    rows = query_d1("SELECT * FROM campuses WHERE campus_code = ?", [campus_code])
    return rows[0]

# ---------------------------
# DELETE Campus
# ---------------------------
@router.delete("/{campus_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campus(campus_code: str, _: dict = Depends(admin_only)):
    existing = query_d1("SELECT * FROM campuses WHERE campus_code = ?", [campus_code])
    if not existing:
        raise HTTPException(404, "Campus not found")

    query_d1("DELETE FROM scan_points WHERE campus_code = ?", [campus_code])
    query_d1("DELETE FROM qr WHERE campus_code = ?", [campus_code])
    query_d1("DELETE FROM campuses WHERE campus_code = ?", [campus_code])
    return
