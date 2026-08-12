
class CampusCreate(BaseModel):

    campus_code: str
    campus_name: str

    location: Optional[str] = None

    # ✅ MUST EXIST
    campus_address: Optional[str] = None
