from datetime import datetime
from typing import List
from uuid import UUID
from pydantic import BaseModel

class QualificationSkills(BaseModel):
    required: List[str] = []
    preferred: List[str] = []

class JobDescriptionBase(BaseModel):
    title: str
    company: str
    summary: str
    responsibility_duties: str
    qualification_skills: QualificationSkills
    work_environment: str
    salary_benefits: str

class JobCreate(JobDescriptionBase):
    pass

class JobUpdate(JobDescriptionBase):
    pass

class JobDescription(JobDescriptionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
