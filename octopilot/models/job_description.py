from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, JSON, UUID
from .base import Base

class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(UUID, primary_key=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    summary = Column(String, nullable=False)
    responsibility_duties = Column(String, nullable=False)
    qualification_skills = Column(JSON, nullable=False, default={
        "required": [],
        "preferred": []
    })
    work_environment = Column(String, nullable=False)
    salary_benefits = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
