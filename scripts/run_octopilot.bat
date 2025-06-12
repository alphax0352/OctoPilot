@echo off
uvicorn octopilot.main:app --reload --host 0.0.0.0 --port 8000
