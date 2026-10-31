import os
from dotenv import load_dotenv

# Ensure .env in parent backend directory is loaded
env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_file, override=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SECRET_KEY") or os.getenv("SUPABASE_PUBLISHABLE_KEY")
SECRET_KEY = os.getenv("SECRET_KEY") or os.getenv("JWT_SECRET") or "fallback_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
