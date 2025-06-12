from typing import Dict, Optional, Union
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.remote.webelement import WebElement
from pydantic import BaseModel

class FormField(BaseModel):
    field_type: str
    value: str
    required: bool = False
    selector: str
    selector_type: str = "id"

class FormFiller:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)
        
    async def fill_form(self, form_data: Dict[str, FormField]) -> bool:
        """Fill form fields based on provided mapping"""
        success = True
        for field_name, field_info in form_data.items():
            try:
                await self._fill_field(field_info)
            except Exception as e:
                success = False
                
        return success

    async def _fill_field(self, field_info: FormField) -> None:
        """Handle different types of form fields"""
        element = await self._find_element(field_info.selector, field_info.selector_type)
        
        if field_info.field_type == "text":
            await self._fill_text_field(element, field_info.value)
        elif field_info.field_type == "select":
            await self._handle_dropdown(element, field_info.value)
        elif field_info.field_type == "radio":
            await self._handle_radio(element, field_info.value)
        elif field_info.field_type == "checkbox":
            await self._handle_checkbox(element, field_info.value)
        elif field_info.field_type == "file":
            await self._handle_file_upload(element, field_info.value)

    async def _find_element(self, selector: str, selector_type: str) -> WebElement:
        """Find element with wait and multiple selector strategies"""
        selector_map = {
            "id": By.ID,
            "name": By.NAME,
            "xpath": By.XPATH,
            "css": By.CSS_SELECTOR
        }
        
        return self.wait.until(
            EC.presence_of_element_located(
                (selector_map[selector_type], selector)
            )
        )

    async def _fill_text_field(self, element: WebElement, value: str) -> None:
        """Fill text input with clear and type"""
        element.clear()
        element.send_keys(value)

    async def _handle_dropdown(self, element: WebElement, value: str) -> None:
        """Handle dropdown selection"""
        from selenium.webdriver.support.select import Select
        select = Select(element)
        select.select_by_visible_text(value)

    async def _handle_radio(self, element: WebElement, value: str) -> None:
        """Handle radio button selection"""
        if str(value).lower() == "true":
            if not element.is_selected():
                element.click()

    async def _handle_checkbox(self, element: WebElement, value: str) -> None:
        """Handle checkbox toggle"""
        current_state = element.is_selected()
        desired_state = str(value).lower() == "true"
        
        if current_state != desired_state:
            element.click()

    async def _handle_file_upload(self, element: WebElement, file_path: str) -> None:
        """Handle file upload inputs"""
        element.send_keys(file_path)

    async def submit_form(self, submit_button_selector: str) -> bool:
        """Submit the form and handle result"""
        try:
            submit_button = await self._find_element(submit_button_selector, "css")
            submit_button.click()
            return True
        except Exception:
            return False

    async def verify_submission(self, success_indicator: str) -> bool:
        """Verify if form submission was successful"""
        try:
            self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, success_indicator))
            )
            return True
        except Exception:
            return False
