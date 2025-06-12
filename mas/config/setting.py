from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DB_HOST: str
    DB_PORT: str
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    # Multi Agent System
    OPENAI_API_KEY: str
    FIRECRAWL_API_KEY: str
    
    # LOG FILE PATH
    AGENT_LOG_PATH: str
    LOG_FILE_OR_CONSOLE: bool = False
    
    # Working Directory
    WORKING_DIRECTORY: str = "./data/resumes"
    CONDA_ENV: str = "octopilot"

    class Config:
        env_file = "mas/.env"


settings = Settings()
