from pydantic import BaseModel, EmailStr, HttpUrl, field_validator, constr
from typing import List, Optional
from datetime import date
import re

class PersonalInformationBase(BaseModel):
    name: Optional[str] = constr(min_length=2, max_length=50)    
    surname: Optional[str] = [constr(min_length=2, max_length=50)]
    date_of_birth: Optional[str]
    country: Optional[str] = [constr(min_length=2, max_length=100)]
    city: Optional[str] = [constr(min_length=2, max_length=100)]
    address: Optional[str] = [constr(max_length=200)]
    zip_code: Optional[str] = [constr(max_length=10)]
    phone_prefix: Optional[str] = [constr(max_length=5)]
    phone: Optional[str] = [constr(max_length=15)]
    email: Optional[EmailStr]
    github: Optional[HttpUrl]
    linkedin: Optional[HttpUrl]

    @field_validator('date_of_birth')
    def validate_date_of_birth(cls, v):
        if v:
            try:
                date.fromisoformat(v)
                return v
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD')
        return v

    @field_validator('phone')
    def validate_phone(cls, v):
        if v:
            if not re.match(r'^\+?[\d\s-]+$', v):
                raise ValueError('Invalid phone number format')
        return v

class EducationBase(BaseModel):
    education_level: Optional[str] = [constr(min_length=2, max_length=100)]
    institution: Optional[str] = [constr(min_length=2, max_length=200)]
    field_of_study: Optional[str] = [constr(min_length=2, max_length=200)]
    final_evaluation_grade: Optional[str] = [constr(max_length=20)]
    start_date: Optional[str]
    year_of_completion: Optional[int]

    @field_validator('year_of_completion')
    def validate_year(cls, v):
        if v:
            current_year = date.today().year
            if v < 1900 or v > current_year + 10:
                raise ValueError(f'Year must be between 1900 and {current_year + 10}')
        return v

    @field_validator('start_date')
    def validate_start_date(cls, v):
        if v:
            try:
                date.fromisoformat(v)
                return v
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD')
        return v

class ExperienceBase(BaseModel):
    position: Optional[str] = [constr(min_length=2, max_length=100)]
    company: Optional[str] = [constr(min_length=2, max_length=200)]
    employment_period: Optional[str] = [constr(max_length=100)]
    location: Optional[str] = [constr(max_length=200)]
    industry: Optional[str] = [constr(max_length=100)]

    @field_validator('employment_period')
    def validate_employment_period(cls, v):
        if v:
            # Basic format validation for period like "2020-01 to 2023-12" or "2020-01 to Present"
            pattern = r'^\d{4}-\d{2}\s+to\s+(?:\d{4}-\d{2}|Present)$'
            if not re.match(pattern, v):
                raise ValueError('Invalid employment period format. Use YYYY-MM to YYYY-MM or YYYY-MM to Present')
        return v

class CertificationBase(BaseModel):
    name: Optional[str] = [constr(min_length=2, max_length=200)]
    description: Optional[str] = [constr(max_length=500)]

class ResumeCreate(BaseModel):
    personal_information: PersonalInformationBase
    education_details: List[EducationBase]
    experience_details: List[ExperienceBase]
    certifications: List[CertificationBase]

class Resume(ResumeCreate):
    id: int
    
    class Config:
        from_attributes = True
