from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SelfIdentificationBase(BaseModel):
    gender: str
    pronouns: str
    veteran: str
    disability: str
    ethnicity: str

class LegalAuthorizationBase(BaseModel):
    eu_work_authorization: str
    us_work_authorization: str
    requires_us_visa: str
    legally_allowed_to_work_in_us: str
    requires_us_sponsorship: str
    requires_eu_visa: str
    legally_allowed_to_work_in_eu: str
    requires_eu_sponsorship: str
    canada_work_authorization: str
    requires_canada_visa: str
    legally_allowed_to_work_in_canada: str
    requires_canada_sponsorship: str
    uk_work_authorization: str
    requires_uk_visa: str
    legally_allowed_to_work_in_uk: str
    requires_uk_sponsorship: str

class WorkPreferencesBase(BaseModel):
    remote_work: str
    in_person_work: str
    open_to_relocation: str
    willing_to_complete_assessments: str
    willing_to_undergo_drug_tests: str
    willing_to_undergo_background_checks: str

class ApplicationBase(BaseModel):
    notice_period: str
    salary_range_usd: str

class ApplicationCreate(ApplicationBase):
    self_identification: SelfIdentificationBase
    legal_authorization: LegalAuthorizationBase
    work_preferences: WorkPreferencesBase

class Application(ApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    self_identification: SelfIdentificationBase
    legal_authorization: LegalAuthorizationBase
    work_preferences: WorkPreferencesBase

    class Config:
        from_attributes = True
