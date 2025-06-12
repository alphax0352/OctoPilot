from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import create_engine
from octopilot.config import settings

DB_HOST = settings.DB_HOST
DB_PORT = settings.DB_PORT
DB_USER = settings.DB_USER
DB_PASSWORD = settings.DB_PASSWORD
DB_NAME = settings.DB_NAME

async def get_async_conn():
    # Async database URL and engine
    async_db_url = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    async_engine = create_async_engine(async_db_url)
    async_session = async_sessionmaker(bind=async_engine, expire_on_commit=False)
    
    async with async_session() as db:
        yield db

def get_sync_conn():
    # Sync database URL and engine
    sync_db_url = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    sync_engine = create_engine(sync_db_url)
    sync_session = sessionmaker(bind=sync_engine)
    with sync_session() as db:
        yield db