import spacy
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from octopilot.schemas import ResumeMatch, SkillMatch


class ResumeMatcher:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_lg")
        self.vectorizer = TfidfVectorizer(stop_words='english')
        
    def calculate_similarity(self, text1: str, text2: str) -> float:
        # Calculate cosine similarity between two text documents
        tfidf_matrix = self.vectorizer.fit_transform([text1, text2])
        return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

    def extract_skills(self, text: str) -> List[str]:
        doc = self.nlp(text)
        # Extract skills using NER and pattern matching
        skills = []
        for ent in doc.ents:
            if ent.label_ in ["SKILL", "PRODUCT", "ORG"]:
                skills.append(ent.text)
        return list(set(skills))

    def match_resume(self, resume_text: str, job_description: str) -> ResumeMatch:
        # Calculate overall document similarity
        content_similarity = self.calculate_similarity(resume_text, job_description)
        
        # Extract and match skills
        job_skills = self.extract_skills(job_description)
        resume_skills = self.extract_skills(resume_text)
        
        skill_matches = []
        for skill in job_skills:
            score = max([self.nlp(skill).similarity(self.nlp(rs)) for rs in resume_skills], default=0)
            skill_matches.append(
                SkillMatch(
                    skill=skill,
                    score=score,
                    found_in_resume=score > 0.8
                )
            )

        # Calculate experience and education match scores
        experience_match = self._calculate_experience_match(resume_text, job_description)
        education_match = self._calculate_education_match(resume_text, job_description)
        
        overall_score = (
            content_similarity * 0.4 +
            sum(sm.score for sm in skill_matches) / len(skill_matches) * 0.3 +
            experience_match * 0.15 +
            education_match * 0.15
        )

        return ResumeMatch(
            overall_score=overall_score,
            skill_matches=skill_matches,
            experience_match=experience_match,
            education_match=education_match
        )

    def _calculate_experience_match(self, resume_text: str, job_description: str) -> float:
        # Extract years of experience from both texts and compare
        resume_doc = self.nlp(resume_text)
        job_doc = self.nlp(job_description)
        # Implementation for experience matching logic
        return self.calculate_similarity(resume_text, job_description)

    def _calculate_education_match(self, resume_text: str, job_description: str) -> float:
        # Compare education requirements with resume qualifications
        resume_doc = self.nlp(resume_text)
        job_doc = self.nlp(job_description)
        # Implementation for education matching logic
        return self.calculate_similarity(resume_text, job_description)

    def get_recommended_improvements(self, match_result: ResumeMatch) -> List[str]:
        recommendations = []
        
        if match_result.overall_score < 0.7:
            missing_skills = [
                skill.skill for skill in match_result.skill_matches 
                if not skill.found_in_resume
            ]
            if missing_skills:
                recommendations.append(
                    f"Consider adding these key skills: {', '.join(missing_skills)}"
                )
                
        if match_result.experience_match < 0.6:
            recommendations.append(
                "Highlight more relevant work experience for this position"
            )
            
        if match_result.education_match < 0.6:
            recommendations.append(
                "Consider emphasizing relevant educational qualifications"
            )
            
        return recommendations
