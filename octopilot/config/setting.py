from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Project
    PROJECT_NAME: str
    PREFIX_API_STR:str
    BACKEND_CORS_ORIGINS:str
    NEXT_PUBLIC_API_URL:str
    
    # Database
    DB_HOST: str
    DB_PORT: str
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    # OpenAI
    OPENAI_API_KEY: str
    
    # CludFlare Checkbox
    CLOUDFLARE_CHECKBOX_WHITE_PATH: str
    CLOUDFLARE_CHECKBOX_BLACK_PATH: str
    
    # LOG
    LOGURU_LOG_PATH: str
    SELENIUM_LOG_PATH: str
    LOG_FILE_OR_CONSOLE: bool = True
    
    # Path - Resume, Cover Letter
    RESUME_PARENT_PATH: str
    COVER_LETTER_PARENT_PATH: str
    
    

    class Config:
        env_file = ".env"


settings = Settings()
