from fastapi import APIRouter, Body
from typing import Dict
from pydantic import EmailStr
from octopilot.scrapers import (
    IndeedBot,
    MonsterBot,
    GlassDoorBot,
    AdzunaBot,
)

router = APIRouter()
scrapers: Dict[str, IndeedBot] =        {}     # Dictionary to store scrap bots by user ID


@router.post("/indeed")
async def scrap_indeed_jobs(
    userid: str = Body(...),
    email: EmailStr = Body(...),
    password: str = Body(...),
    keywords: str = Body(...)
):
    if userid in scrapers:
        # if there is a bot for this user
        indeed_bot = scrapers["indeed"]
        indeed_bot.run()
    else:
        # if there is no bot for this user
        indeed_bot = IndeedBot(email, password, keywords)
        await indeed_bot.__init_driver__()
        
        scrapers["indeed"] = indeed_bot
        await indeed_bot.run()


@router.post("/monster")
async def scrap_monster_jobs(
    userid: str = Body(...),
    email: EmailStr = Body(...),
    password: str = Body(...),
    keywords: str = Body(...)
):
    if userid in scrapers:
        # if there is a bot for this user
        monster_bot = scrapers["monster"]
        monster_bot.run()
    else:
        # if there is no bot for this user
        monster_bot = MonsterBot(email, password, keywords)
        await monster_bot.__init_driver__()
        
        scrapers["monster"] = monster_bot
        await monster_bot.run()



@router.post("/glassdoor")
async def scrap_glassdoor_jobs(
    userid: str = Body(...),
    email: EmailStr = Body(...),
    password: str = Body(...),
    keywords: str = Body(...)
):
    if userid in scrapers:
        # if there is a bot for this user
        glassdoor_bot = scrapers["glassdoor"]
        glassdoor_bot.run()
    else:
        # if there is no bot for this user
        glassdoor_bot = IndeedBot(email, password, keywords)
        await glassdoor_bot.__init_driver__()
        
        scrapers["glassdoor"] = glassdoor_bot
        await glassdoor_bot.run()


@router.post("/adzuna")
async def scrap_adzuna_jobs(
    userid: str = Body(...),
    email: EmailStr = Body(...),
    password: str = Body(...),
    keywords: str = Body(...)
):
    if userid in scrapers:
        # if there is a bot for this user
        adzuna_bot = scrapers["adzuna"]
        adzuna_bot.run()
    else:
        # if there is no bot for this user
        adzuna_bot = IndeedBot(email, password, keywords)
        await adzuna_bot.__init_driver__()
        
        scrapers["adzuna"] = adzuna_bot
        await adzuna_bot.run()
