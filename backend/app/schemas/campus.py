from pydantic import BaseModel
from typing import Optional


# Request model
class CampusCreate(BaseModel):
    campus_code: str
    campus_name: str
    location: Optional[str] = None
    campus_address: Optional[str] = None


# Response model
class CampusResponse(BaseModel):

    campus_code: str
    campus_name: str

    location: Optional[str] = None

    # ✅ ADD THIS
    campus_address: Optional[str] = None

    is_active: Optional[bool] = True
    created_at: Optional[str] = None


    class Config:
        from_attributes = True
