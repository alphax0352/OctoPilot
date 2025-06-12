from typing import List
from pydantic import BaseModel


class SkillMatch(BaseModel):
    skill: str
    score: float
    found_in_resume: bool

class ResumeMatch(BaseModel):
    overall_score: float
    skill_matches: List[SkillMatch]
    experience_match: float
    education_match: float
    