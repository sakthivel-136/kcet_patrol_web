from fastapi import APIRouter, HTTPException, status, Depends
from app.database import insert_row, select_rows, create_qr, update_qr, delete_row
from app.dependencies import get_current_user, admin_only

router = APIRouter(
    prefix="/qr",
    tags=["QR Codes"]
)

TABLE = "qr"


# ---------------------------
# CREATE QR
# ---------------------------
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_qr_endpoint(data: dict, _: dict = Depends(admin_only)):
    """
    Create a new QR code.
    """

    # Remove qr_id if frontend sends it
    data.pop("qr_id", None)

    # ✅ Validate waiting_time
    if "waiting_time" not in data:
        raise HTTPException(
            status_code=400,
            detail="waiting_time is required"
        )

    if not isinstance(data["waiting_time"], int) or data["waiting_time"] < 0:
        raise HTTPException(
            status_code=400,
            detail="waiting_time must be a non-negative integer"
        )

    # Create QR using helper
    result = create_qr(data)

    return result


from app.utils.security import generate_qr_token, verify_qr_token

# ---------------------------
# GET QR BY FACTORY
# ---------------------------
@router.get("/campus/{campus_code}")
def get_qr_by_campus(campus_code: str, _: dict = Depends(get_current_user)):
    results = select_rows(TABLE, {"campus_code": campus_code})
    if results:
        for r in results:
            r["secure_token"] = generate_qr_token(r["qr_id"])
    return results or []


# ---------------------------
# GET QR BY ID
# ---------------------------
@router.get("/{qr_id_or_token}")
def get_qr_by_id(qr_id_or_token: str, _: dict = Depends(get_current_user)):
    if ":" in qr_id_or_token:
        real_id = verify_qr_token(qr_id_or_token)
        if not real_id:
            raise HTTPException(status_code=403, detail="Invalid secure token")
        qr_id = int(real_id)
    else:
        try:
            qr_id = int(qr_id_or_token)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid QR ID format")
            
    rows = select_rows(TABLE, {"qr_id": qr_id})
    if not rows:
        raise HTTPException(status_code=404, detail="QR not found")
    
    result = rows[0]
    result["secure_token"] = generate_qr_token(result["qr_id"])
    return result


# ---------------------------
# UPDATE QR
# ---------------------------
@router.put("/{qr_id}")
def update_qr_endpoint(qr_id: int, data: dict, _: dict = Depends(admin_only)):
    """
    Update a QR code
    """

    data.pop("qr_id", None)

    # ✅ Validate waiting_time if provided
    if "waiting_time" in data:
        if not isinstance(data["waiting_time"], int) or data["waiting_time"] < 0:
            raise HTTPException(
                status_code=400,
                detail="waiting_time must be a non-negative integer"
            )

    try:
        updated = update_qr(qr_id, data)
    except RuntimeError:
        raise HTTPException(status_code=404, detail="QR not found or update failed")

    if isinstance(updated, dict):
        return [updated]

    return updated


# ---------------------------
# DELETE QR
# ---------------------------
@router.delete("/{qr_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_qr_endpoint(qr_id: int, _: dict = Depends(admin_only)):
    success = delete_row(TABLE, {"qr_id": qr_id})
    if not success:
        raise HTTPException(status_code=404, detail="QR not found")

    return {"message": "Deleted successfully"}
