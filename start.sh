#!/usr/bin/env bash
# Startup script for Bienvenue (FastAPI Backend + React Frontend)

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================================="
echo "🇫🇷 Starting BIENVENUE (French in your language)"
echo "=========================================================="

# 1. Start FastAPI Backend in background
echo "-> Launching FastAPI Backend on http://127.0.0.1:8000..."
PYTHONPATH=. "$DIR/backend/venv/bin/uvicorn" backend.app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# 2. Trap SIGINT/SIGTERM to cleanly kill backend
trap "echo 'Stopping Bienvenue servers...'; kill $BACKEND_PID 2>/dev/null || true; exit" SIGINT SIGTERM EXIT

# 3. Start Frontend Dev Server
echo "-> Launching Frontend Web Client on http://localhost:5173..."
cd "$DIR/frontend"
npm run dev -- --host 127.0.0.1 --port 5173

wait $BACKEND_PID
