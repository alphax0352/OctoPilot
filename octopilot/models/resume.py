from datetime import datetime, timezone
from sqlalchemy import Column, String, ForeignKey, UUID, DateTime, Date, Enum, JSON
from sqlalchemy.orm import relationship
from .base import Base
import enum

class RoleEnum(enum.Enum):
    AI_ENGINEER = "AI Engineer"
    DEVOPS_ENGINEER = "DevOps Engineer"
    SOFTWARE_ENGINEER = "Software Engineer"
    FRONTEND_ENGINEER = "Frontend Engineer"
    BACKEND_ENGINEER = "Backend Engineer"

class PersonalInformation(Base):
    __tablename__ = "personal_information"
    
    id = Column(UUID, primary_key=True)
    userId = Column(UUID, ForeignKey("users.id"))
    fname = Column(String)
    lname = Column(String)
    date_of_birth = Column(String)
    country = Column(String)
    city = Column(String)
    address = Column(String)
    zip_code = Column(String)
    phone_prefix = Column(String)
    phone = Column(String)
    email = Column(String)
    linkedin = Column(String)
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))


class EmploymentHistory(Base):
    __tablename__ = "employment_history"
    
    id = Column(UUID, primary_key=True)
    userId = Column(UUID, ForeignKey("users.id"))
    position = Column(String)
    company = Column(String)
    start = Column(Date)
    end = Column(Date)
    location = Column(String)
    industry = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))


class Portfolio(Base):
    __tablename__ = "portfolio"
    
    id = Column(UUID, primary_key=True)
    userId = Column(UUID, ForeignKey("users.id"))
    role = Column(Enum(RoleEnum))
    projects = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    
class Education(Base):
    __tablename__ = "education"
    
    id = Column(UUID, primary_key=True)
    userId = Column(UUID, ForeignKey("users.id"))
    degree = Column(String)
    university = Column(String)
    field_of_study = Column(String)
    start = Column(Date)
    end = Column(Date)
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

