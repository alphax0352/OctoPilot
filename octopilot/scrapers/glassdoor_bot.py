import json
import asyncio
from typing import List
from pydantic import EmailStr
from selenium_driverless import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from .base_bot import BaseBot
from octopilot.config import logger
from octopilot.utils import (
    get_descriptions,
    generate_resumes,
    save_resumes,
    make_applications,
    generate_answer
)
from octopilot.utils import bypass_pagecaptcha


class GlassDoorBot(BaseBot):
    def __init__(self, email: EmailStr, password:str, keywords: str) -> None:
        super().__init__(email=email, password=password)
        self.name = "GlassDoorBot"
        self.description = "A bot that applies to jobs on glassdoor.com"
        self.keyword = keywords
        self.driver = None
        
    async def __init_driver__(self):
        options = webdriver.ChromeOptions()
        options.add_argument("--lang=en")
        
        # Cookie persistence
        # options.add_argument(f"--user-data-dir=./data/browser_data")
        # options.add_argument(f"--profile-directory=Profile1")
        
        self.driver = await webdriver.Chrome(options=options, timeout=60)


    async def login(self) -> None:
        try:
            await self.driver.get("https://secure.indeed.com/account/login", wait_load=True)
            await self.driver.sleep(3)
            await bypass_pagecaptcha(self.driver)
            
            google_button = await self.driver.find_element(By.ID, "login-google-button", timeout=10)
            await google_button.click(move_to=True)
            google_window = (await self.driver.window_handles)[-1]
            await self.driver.switch_to.window(google_window)
            await self.driver.sleep(5)
            
            logger.info("Google login window opened")
            
            await asyncio.sleep(5)

            email_field = await self.driver.find_element(By.ID, "identifierId", timeout=10)
            await asyncio.sleep(10)
            await email_field.send_keys(self.email)
            print("🚀", self.email)
            await asyncio.sleep(20)
            await email_field.send_keys(Keys.ENTER)
            await asyncio.sleep(5)
            
            logger.info("Email entered")
            
            password_field = await self.driver.find_element(By.CSS_SELECTOR, "input[type='password']", timeout=10)
            await password_field.send_keys(self.password)
            await self.driver.sleep(7)
            await password_field.send_keys(Keys.ENTER)
            await self.driver.sleep(3)
            
            logger.info("Password entered")
            
            main_window = self.driver.window_handles[0]
            self.driver.switch_to.window(main_window)
            
            logger.success("Successfully logged into Indeed using Google")
        
        except Exception as e:
            logger.error(f"Failed to login to Indeed with Google: {str(e)}")

    async def bypass_onboarding(self):
        try:
            selector = "//button[contains(text(), 'Continue')]"
            onboarding_steps = ["location", "pay_preference", "job_preference", "skill_preference"]
            for step in onboarding_steps:
                button = await self.driver.find_element(By.XPATH, selector)
                await button.click(move_to=True)
            
            logger.info("Successfully bypassed onboarding flow")
            
        except Exception as e:
            logger.error(f"Error during onboarding bypass: {str(e)}")

    async def search_jobs(self, keywords) -> List[str]:
        job_links = []
        try:
            await self.driver.get("https://www.indeed.com")
            
            search_box = await self.driver.find_element(By.ID, "text-input-what")
            await search_box.clear()
            await search_box.send_keys(keywords)
            await self.driver.sleep(5)
            await search_box.send_keys(Keys.RETURN)
            await self.driver.sleep(5)
            logger.info("Inserted keywords")
            
            try:
                easy_apply_filter = await self.driver.find_element(By.XPATH, "//button[contains(text(), 'Easy Apply')]")
                await easy_apply_filter.click()
            except:
                logger.info("Easy Apply filter not available")

            page = 1
            while True:
                job_cards = await self.driver.find_elements(By.CLASS_NAME, "job_seen_beacon")
                
                for card in job_cards:
                    try:
                        job_link = await (await card.find_element(By.CSS_SELECTOR, "h2.jobTitle a")).get_attribute("href")
                        if job_link:
                            job_links.append(job_link)
                    except:
                        continue
                
                try:
                    next_button = await self.driver.find_element(By.CSS_SELECTOR, "a[aria-label='Next Page']")
                    if not await next_button.is_enabled():
                        break
                    await next_button.click()
                    page += 1
                    await self.driver.sleep(5)
                except:
                    break
                    
            logger.info(f"Found {len(job_links)} job links across {page} pages")
            return job_links

        except Exception as e:
            logger.error(f"Error during job search: {str(e)}")
            return job_links

    async def get_job_descriptions(self, job_url:str, application: json):
        try:
            await self.driver.get(job_url)
            apply_button = await self.driver.find_element(By.XPATH, "//button[contains(text(), 'Apply now')]")
            await apply_button.click(move_to=True)
            await self.driver.sleep(5)
            logger.info("Clicked on Apply now button")
            
            await self.driver.find_element(By.CLASS_NAME, "ia-BasePage")
            questions = await self.driver.find_elements(By.CLASS_NAME, "ia-Questions-item")
            for question in questions:
                question_text = await (await question.find_element(By.CLASS_NAME, "ia-Questions-item-label")).text
                logger.info(f"Question: {question_text}")
                
                response = generate_answer(question_text)
                self.driver.sleep(7)
                input_field = await question.find_element(By.TAG_NAME, "input")
                await input_field.send_keys(response)
                self.driver.sleep(5)
                logger.info(f"Answered question: {question_text}")
            
            try:
                resume_upload = await self.driver.find_element(By.CSS_SELECTOR, "input[type='file']")
                await resume_upload.send_keys(application['resume_path'])
                logger.info("Resume uploaded")
            except:
                logger.info("No resume upload required")
            
            submit_button = await self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
            await submit_button.click()
            
            await self.driver.find_element(By.CLASS_NAME, "ia-BasePage-success")
            logger.info(f"Successfully applied to job at {job_url}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to apply to job at {job_url}: {str(e)}")
            return False
    
    async def run(self):
        await self.login()
        await self.bypass_onboarding()
        # job_urls = await self.search_jobs(keywords = self.keyword)
        # descriptions = get_descriptions(job_urls = job_urls)
        # resumes = generate_resumes(descriptions= descriptions)
        # paths = save_resumes(resumes = resumes)
        # applications = make_applications(paths=paths)
        
        # for job_url, application in zip(job_urls, applications):
        #     await self.apply_job(job_url, application)
