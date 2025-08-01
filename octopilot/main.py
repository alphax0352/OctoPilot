from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from octopilot.config import settings
from octopilot.api import api_router

app = FastAPI()

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "*"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
app.include_router(router=api_router, prefix=settings.PREFIX_API_STR)
