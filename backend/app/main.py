# app/main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

# -----------------------------
# Import routers
# -----------------------------
from app.routes import (
    auth,
    admin,
    campuses,
    scan_points,
    security_users,
    qr,
    scanning_details,
    report_download,
    shifts,
    allocations
)

# Dependency for JWT authentication
from app.dependencies import get_current_user


# -----------------------------
# Initialize FastAPI app
# -----------------------------
app = FastAPI(
    title="Security Verifier API",
    version="1.0.0",
    description="Backend API for Security Verifier system"
)


# -----------------------------
# CORS CONFIGURATION
# -----------------------------
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://172.16.16.100:3000",
    "http://10.10.3.2:3000",
    "https://apps.pentagontextiles.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Include routers
# -----------------------------

# 🔓 Auth → Open access
app.include_router(auth.router)

# 🔐 Admin → JWT required (Protected)
app.include_router(
    admin.router,
    dependencies=[Depends(get_current_user)]
)

# 🏭 Campuses
app.include_router(campuses.router)

# 📍 Scan Points
app.include_router(scan_points.router)

# 👮 Security Users
app.include_router(security_users.router)

# 🔳 QR Codes
app.include_router(qr.router)

# 📲 Scanning (Mobile)
app.include_router(scanning_details.router)

# 📄 Report Download (Patrol Report)
app.include_router(report_download.router)

# 🕒 Shifts
app.include_router(shifts.router)

# 📅 Shift Allocations
app.include_router(allocations.router)

# -----------------------------
# Root endpoint
# -----------------------------
@app.get("/", summary="API Root")
def root():
    return {
        "message": "Security Verifier API is running ✅"
    }
