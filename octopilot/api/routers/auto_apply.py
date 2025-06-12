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
octopilot_indeed_bots: Dict[str, IndeedBot] =        {}     # Dictionary to store Indeed bots by user ID
octopilot_monster_bots: Dict[str, MonsterBot] =      {}     # Dictionary to store Monster bots by user ID
octopilot_glassdoor_bots: Dict[str, GlassDoorBot] =  {}     # Dictionary to store Glassdoor bots by user ID
octopilot_adzuna_bots: Dict[str, AdzunaBot] =        {}     # Dictionary to store Adzuna bots by user ID

@router.post("/indeed")
async def auto_apply_indeed(
    userid: str = Body(...),
    email: EmailStr = Body(...),
    password: str = Body(...),
    keywords: str = Body(...)
):
    if userid in octopilot_indeed_bots:
        # if there is a bot for this user
        indeed_bot = octopilot_indeed_bots[userid]
        indeed_bot.run()
    else:
        # if there is no bot for this user
        indeed_bot = IndeedBot(email, password, keywords)
        await indeed_bot.__init_driver__()
        
        octopilot_indeed_bots[userid] = indeed_bot
        await indeed_bot.run()


@router.post("/monster")
async def auto_apply_indeed(
    userid: str = Body(...),
    email: EmailStr = Body(...),
    password: str = Body(...),
    keywords: str = Body(...)
):
    if userid in octopilot_monster_bots:
        # if there is a bot for this user
        monster_bot = octopilot_monster_bots[userid]
        monster_bot.run()
    else:
        # if there is no bot for this user
        monster_bot = MonsterBot(email, password, keywords)
        await monster_bot.__init_driver__()
        octopilot_monster_bots[userid] = monster_bot
        await monster_bot.run()


@router.post("/glassdoor")
async def auto_apply_indeed(
    userid: str = Body(...),
    email: EmailStr = Body(...),
    password: str = Body(...),
    keywords: str = Body(...)
):
    if userid in octopilot_glassdoor_bots:
        # if there is a bot for this user
        glassdoor_bot = octopilot_glassdoor_bots[userid]
        glassdoor_bot.run()
    else:
        # if there is no bot for this user
        octopilot = GlassDoorBot(email, password, keywords)
        await octopilot.__init_driver__()
        
        octopilot_glassdoor_bots[userid] = glassdoor_bot
        await glassdoor_bot.run()


@router.post("/adzuna")
async def auto_apply_adzuna(
    userid: str = Body(...),
    email: EmailStr = Body(...),
    password: str = Body(...),
    keywords: str = Body(...)
):
    if userid in octopilot_adzuna_bots:
        # if there is a bot for this user
        adzuna_bot = octopilot_adzuna_bots[userid]
        adzuna_bot.run()
    else:
        # if there is no bot for this user
        adzuna_bot = AdzunaBot(email, password, keywords)
        await adzuna_bot.__init_driver__()
        
        octopilot_adzuna_bots[userid] = adzuna_bot
        await adzuna_bot.run()