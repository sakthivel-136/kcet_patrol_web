import hmac
import hashlib
import os

SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY", "kcet_patrol_super_secret_key_123!").encode("utf-8")

def generate_qr_token(qr_id: int) -> str:
    """
    Generates a secure, signed token for a given QR ID.
    Format: qr_id:signature
    """
    message = str(qr_id).encode("utf-8")
    signature = hmac.new(SECRET_KEY, message, hashlib.sha256).hexdigest()[:16]
    return f"{qr_id}:{signature}"

def verify_qr_token(token: str) -> str:
    """
    Verifies a secure QR token.
    Returns the real qr_id as a string if valid, otherwise returns None.
    """
    if not token or ":" not in token:
        return None
        
    try:
        qr_id_str, provided_signature = token.split(":")
        # Generate what the signature SHOULD be
        expected_signature = generate_qr_token(int(qr_id_str)).split(":")[1]
        
        # Compare securely
        if hmac.compare_digest(provided_signature, expected_signature):
            return qr_id_str
    except Exception:
        pass
        
    return None
