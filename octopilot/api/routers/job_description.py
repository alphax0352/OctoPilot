from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from octopilot.utils import get_async_conn
from octopilot.models import JobDescription as JobModel
from octopilot.schemas import JobDescription as JobSchema

router = APIRouter()

@router.get("/{job_id}", response_model=JobSchema)
async def get_job_description(
    job_id: int,
    db: Session = Depends(get_async_conn)
):
    job = db.query(JobModel).filter(JobModel.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/", response_model=List[JobSchema])
async def get_job_descriptions(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_async_conn)
):
    jobs = db.query(JobModel).offset(skip).limit(limit).all()
    return jobs


@router.delete("/{job_id}")
async def delete_job_description(
    job_id: int,
    db: Session = Depends(get_async_conn)
):
    db_job = db.query(JobModel).filter(JobModel.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(db_job)
    db.commit()
    return {"message": "Job deleted successfully"}

@router.get("/search/", response_model=List[JobSchema])
async def search_job_descriptions(
    keyword: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_async_conn)
):
    query = db.query(JobModel)
    if keyword:
        query = query.filter(JobModel.title.ilike(f"%{keyword}%"))
    if location:
        query = query.filter(JobModel.location.ilike(f"%{location}%"))
    return query.all()
