from fastapi import APIRouter

from app.api.v1.endpoints import health, auth, exercises, submissions, ai

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(exercises.router, prefix="/exercises", tags=["Exercises"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Mentor"])
