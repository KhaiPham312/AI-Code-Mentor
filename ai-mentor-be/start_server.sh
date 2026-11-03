#!/usr/bin/env bash
# Script khởi chạy Backend AI Code Mentor ở chế độ Multi-Worker Production Ready
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# Kích hoạt virtualenv nếu có
if [ -d "venv" ]; then
    source venv/bin/activate
fi

echo "🚀 Đang khởi động AI Code Mentor Backend (Gunicorn + Uvicorn Workers)..."
echo "📌 Config: gunicorn_conf.py"
echo "🌐 API URL: http://0.0.0.0:8000"
echo "📖 Swagger Docs: http://0.0.0.0:8000/docs"

exec gunicorn app.main:app -c gunicorn_conf.py

