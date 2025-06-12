from fastapi import APIRouter
from . import scraper
from . import auto_apply 
from . import application 
from . import job_description

api_router = APIRouter()
api_router.include_router(scraper.router, prefix="/scraper", tags=["scraper"])
api_router.include_router(auto_apply.router, prefix="/auto-apply", tags=["auto-apply"])
api_router.include_router(application.router, prefix="/application", tags=["application"])
api_router.include_router(job_description.router, prefix="/description", tags=["description"])


@api_router.get("/")
async def root():
    return {"message": "Welcome to the OctoPilot!"}


@api_router.get("/test-mas")
async def test():
    return {"message": "Test route"}