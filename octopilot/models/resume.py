from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from .base import Base

class PersonalInformation(Base):
    __tablename__ = "personal_information"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    surname = Column(String)
    date_of_birth = Column(String)
    country = Column(String)
    city = Column(String)
    address = Column(String)
    zip_code = Column(String)
    phone_prefix = Column(String)
    phone = Column(String)
    email = Column(String)
    github = Column(String)
    linkedin = Column(String)


class Education(Base):
    __tablename__ = "education"
    
    id = Column(Integer, primary_key=True, index=True)
    education_level = Column(String)
    institution = Column(String)
    field_of_study = Column(String)
    final_evaluation_grade = Column(String)
    start_date = Column(String)
    year_of_completion = Column(Integer)
    resume_id = Column(Integer, ForeignKey("resume.id"))


class Experience(Base):
    __tablename__ = "experience"
    
    id = Column(Integer, primary_key=True, index=True)
    position = Column(String)
    company = Column(String)
    employment_period = Column(String)
    location = Column(String)
    industry = Column(String)
    resume_id = Column(Integer, ForeignKey("resume.id"))


class Certification(Base):
    __tablename__ = "certification"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    resume_id = Column(Integer, ForeignKey("resume.id"))


class Resume(Base):
    __tablename__ = "resume"
    
    id = Column(Integer, primary_key=True, index=True)
    personal_information_id = Column(Integer, ForeignKey("personal_information.id"))
    personal_information = relationship("PersonalInformation")
    education_details = relationship("Education")
    experience_details = relationship("Experience")
    certifications = relationship("Certification")
