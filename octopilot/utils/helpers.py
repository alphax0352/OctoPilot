import uuid
from datetime import datetime
from typing import List
from selenium_driverless import webdriver
from selenium.webdriver.common.by import By
from octopilot.models import JobDescription
from octopilot.config import settings, logger
from mas import MASManager

multi_agent_system = MASManager()

async def get_salary(driver: webdriver.Chrome):
    try:
        salary_element = await driver.find_element(By.CLASS_NAME, "jobsearch-JobMetadataHeader-item")
        return await salary_element.text
    except:
        return "Not specified"


async def get_benefits(driver: webdriver.Chrome):
    try:
        benefits = await driver.find_elements(By.XPATH, "//div[contains(@class, 'benefits')]")
        return ", ".join([b.text for b in benefits])
    except:
        return "Not specified"

async def get_description(driver:webdriver.Chrome, job_card_url: str):
    # FIXME: change schema
    try:
        # Wait for job details to load
        driver.get(job_card_url)
        
        # Extract job details
        job_details = {
            "job_id": uuid.uuid4(),
            "title": await driver.find_element(By.CLASS_NAME, "jobsearch-JobInfoHeader-title").text,
            "company": await driver.find_element(By.CLASS_NAME, "jobsearch-InlineCompanyRating").text,
            "description":await driver.find_element(By.CLASS_NAME, "jobsearch-jobDescriptionText").text,
            "location":await driver.find_element(By.CLASS_NAME, "jobsearch-JobInfoHeader-subtitle").text,
            "salary_range":await get_salary(),
            "benefits":await get_benefits(),
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
            
        logger.info(f"Successfully extracted job details for {job_details['title']}")
        return JobDescription(**job_details)
        
    except Exception as e:
        logger.error(f"Error extracting job details: {str(e)}")
        return None


async def get_descriptions(job_urls):
    descriptions = [get_description(job_url) for job_url in job_urls]
    return descriptions


async def generate_resumes(descriptions: str):
    resumes = [multi_agent_system.run(description) for description in descriptions]
    return resumes
    

async def save_resumes(resumes: List[str]):
    parent_path = settings.RESUME_PARENT_PATH
    paths = [parent_path + resume["title"] for resume in resumes]
    for resume_name, idx in enumerate(paths):
        with open(resume_name, encoding="utf-8") as f:
            f.write(resumes[idx])
    
    return paths

async def make_applications(paths):
    application_type = {
        "resume_path": settings.RESUME_PARENT_PATH + "resume_title.pdf" | None,
        "cover_letter_path": settings.COVER_LETTER_PARENT_PATH + "cover_letter.pdf" | None,
        "work_preferences": "",
        "legal_authorization": "",
        "notice_period": "",
        "availability": ""
    }
    applications = [application_type(path) for path in paths]
    
    return applications


def generate_answer(question: str):
    return multi_agent_system.run(question)