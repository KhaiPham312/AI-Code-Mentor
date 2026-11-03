#!/usr/bin/env bash
# Script khởi chạy Celery Judge Worker xử lý chấm code bất đồng bộ
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

if [ -d "venv" ]; then
    source venv/bin/activate
fi

echo "⚖️  Đang khởi động AI Code Mentor Celery Judge Worker..."
echo "🔌 Broker / Backend: Redis (redis://localhost:6379/0)"
echo "🧵 Concurrency: ${CELERY_CONCURRENCY:-4} worker processes"

exec celery -A app.core.celery_app worker --loglevel=info --concurrency=${CELERY_CONCURRENCY:-4}
