
import pyautogui
from selenium_driverless import webdriver
from octopilot.config import logger, settings

async def save_cf_cookie(driver: webdriver.Chrome) -> None:
    cookies = await driver.get_cookies()
    for cookie in cookies:
        if cookie["name"] == "cf_clearance":
            cf_clearance = cookie["value"]
    url =await driver.current_url
    domain = url.split("/")[2]
    cf_clearance_cookie = {
        "name": "cf_clearance",
        "value": cf_clearance,  # Replace with the actual value
        "domain": domain,  # Replace with the actual domain
        "path": "/",
        "secure": True,
        "httpOnly": False,
    }
    await driver.add_cookie(cf_clearance_cookie)
    await driver.refresh()


async def bypass_pagecaptcha(driver: webdriver.Chrome) -> None:
    try:
        title = await driver.title
        if "Just a moment" in title:
            while True:
                try:
                    location = pyautogui.locateOnScreen(settings.CLOUDFLARE_CHECKBOX_PATH, confidence=0.8)
                    if location:
                        center = pyautogui.center(location)
                        pyautogui.click(center)
                        await driver.sleep(2)
                        logger.info("Cloudflare checkbox clicked")
                        break
                except pyautogui.ImageNotFoundException:
                    logger.error("Cloudflare checkbox not found")
                await driver.sleep(2)
            await save_cf_cookie(driver)
        else:
            pass
    except Exception as e:
        logger.error("Error: cloudflare captcha bypass error.")


async def bypass_funcaptcha():
    pass


async def bypass_grecaptcha_v2():
    pass


async def bypass_sitecaptcha(driver: webdriver.Chrome) -> None:
    pass
