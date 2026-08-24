from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .email_analyzer import analyze_email


# Create FastAPI application
app = FastAPI(
    title="Smart Email Classification API",
    description="API for spam detection and email intent classification",
    version="1.0.0"
)


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request structure
class EmailRequest(BaseModel):
    email: str


# Basic health-check endpoint
@app.get("/")
def root():
    return {
        "message": "Smart Email Classification API is running"
    }


# Email classification endpoint
@app.post("/analyze")
def analyze(request: EmailRequest):

    result = analyze_email(request.email)

    return result