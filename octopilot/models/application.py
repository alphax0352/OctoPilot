from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UUID, Enum
from sqlalchemy.orm import relationship
from .base import Base
import enum

class StatusEnum(enum.Enum):
    APPLIED = "applied"
    INTRO = "intro"
    STEP2 = "step 2"
    STEP3 = "step 3"
    STEP4 = "step 4"
    STEP5 = "step 5"
    STEP6 = "step 6"
    FINAL = "final"
    ONBOARDING = "onboarding"
    REJECTED = "rejected"

class SelfIdentification(Base):
    __tablename__ = "self_identification"
    
    id = Column(UUID, primary_key=True)
    userId = Column(UUID, ForeignKey("users.id"))
    gender = Column(String)
    pronouns = Column(String)
    veteran = Column(String)
    disability = Column(String)
    ethnicity = Column(String)
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    

class LegalAuthorization(Base):
    __tablename__ = "legal_authorization"
    
    id = Column(UUID, primary_key=True)
    userId = Column(UUID, ForeignKey("users.id"))
    eu_work_authorization = Column(String)
    us_work_authorization = Column(String)
    requires_us_visa = Column(String)
    legally_allowed_to_work_in_us = Column(String)
    requires_us_sponsorship = Column(String)
    requires_eu_visa = Column(String)
    legally_allowed_to_work_in_eu = Column(String)
    requires_eu_sponsorship = Column(String)
    canada_work_authorization = Column(String)
    requires_canada_visa = Column(String)
    legally_allowed_to_work_in_canada = Column(String)
    requires_canada_sponsorship = Column(String)
    uk_work_authorization = Column(String)
    requires_uk_visa = Column(String)
    legally_allowed_to_work_in_uk = Column(String)
    requires_uk_sponsorship = Column(String)
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    

class WorkPreferences(Base):
    __tablename__ = "work_preferences"
    
    id = Column(UUID, primary_key=True)
    userId = Column(UUID, ForeignKey("users.id"))
    notice_period = Column(String)
    salary_range_usd = Column(String)
    remote_work = Column(String)
    in_person_work = Column(String)
    open_to_relocation = Column(String)
    willing_to_complete_assessments = Column(String)
    willing_to_undergo_drug_tests = Column(String)
    willing_to_undergo_background_checks = Column(String)
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(UUID, primary_key=True)
    userId = Column(UUID, ForeignKey("users.id"))
    resume_path = Column(String, nullable=False)
    cover_letter_path = Column(String, nullable=True)
    self_identification_id = Column(UUID, ForeignKey("self_identification.id"))
    legal_authorization_id = Column(UUID, ForeignKey("legal_authorization.id"))
    work_preferences_id = Column(UUID, ForeignKey("work_preferences.id"))
    status = Column(Enum(StatusEnum))
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

