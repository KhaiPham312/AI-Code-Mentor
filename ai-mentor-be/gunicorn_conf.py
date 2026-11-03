import multiprocessing
import os

# Server socket
bind = os.getenv("GUNICORN_BIND", "0.0.0.0:8000")
backlog = 2048

# Worker processes: default = (2 * CPU cores) + 1, capped between 2 and 8 for typical server
cpu_count = multiprocessing.cpu_count()
workers = int(os.getenv("GUNICORN_WORKERS", min(8, max(2, (cpu_count * 2) + 1))))
worker_class = "uvicorn.workers.UvicornWorker"

# Concurrency & Connections per worker
worker_connections = 1000
timeout = 60
keepalive = 5

# Logging
loglevel = os.getenv("GUNICORN_LOG_LEVEL", "info")
accesslog = "-"
errorlog = "-"

# Process management
preload_app = False  # Avoid DB connection sharing across forked processes
max_requests = 2000  # Restart workers periodically to prevent memory leaks
max_requests_jitter = 200

