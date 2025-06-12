from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .base import Base

class SelfIdentification(Base):
    __tablename__ = "self_identification"
    
    id = Column(Integer, primary_key=True, index=True)
    gender = Column(String)
    pronouns = Column(String)
    veteran = Column(String)
    disability = Column(String)
    ethnicity = Column(String)
    application_id = Column(Integer, ForeignKey("applications.id"))

class LegalAuthorization(Base):
    __tablename__ = "legal_authorization"
    
    id = Column(Integer, primary_key=True, index=True)
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
    application_id = Column(Integer, ForeignKey("applications.id"))

class WorkPreferences(Base):
    __tablename__ = "work_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    remote_work = Column(String)
    in_person_work = Column(String)
    open_to_relocation = Column(String)
    willing_to_complete_assessments = Column(String)
    willing_to_undergo_drug_tests = Column(String)
    willing_to_undergo_background_checks = Column(String)
    application_id = Column(Integer, ForeignKey("applications.id"))

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    notice_period = Column(String)
    salary_range_usd = Column(String)
    resume_path = Column(String, nullable=False)
    cover_letter_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    self_identification = relationship("SelfIdentificationModel", backref="application", uselist=False)
    legal_authorization = relationship("LegalAuthorizationModel", backref="application", uselist=False)
    work_preferences = relationship("WorkPreferencesModel", backref="application", uselist=False)
