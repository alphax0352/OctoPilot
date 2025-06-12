from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from octopilot.utils import get_async_conn
from octopilot.models import Application as ApplicationModel
from octopilot.schemas import Application as ApplicationSchema

router = APIRouter()

@router.get("/", response_model=List[ApplicationSchema])
async def get_applications(db: Session = Depends(get_async_conn)):
    return db.query(ApplicationModel).all()


@router.get("/{application_id}", response_model=ApplicationSchema)
async def get_application(application_id: int, db: Session = Depends(get_async_conn)):
    application = db.query(ApplicationModel).filter(ApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@router.delete("/{application_id}")
async def delete_application(application_id: int, db: Session = Depends(get_async_conn)):
    application = db.query(ApplicationModel).filter(ApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(application)
    db.commit()
    return {"message": "Application deleted successfully"}
