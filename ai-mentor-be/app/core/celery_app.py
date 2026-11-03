import os
from celery import Celery
from app.core.config import settings

# Initialize Celery app with Redis broker and backend
celery_app = Celery(
    "ai_mentor_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.judge_tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30,  # Hard timeout for code judging task (seconds)
    task_soft_time_limit=25,
    worker_concurrency=int(os.getenv("CELERY_CONCURRENCY", 4)),
    worker_prefetch_multiplier=1,  # Fair distribution among judging workers
)
