
import os, sys
from loguru import logger
from .setting import settings


def check_log_file(log_path):
    os.makedirs(os.path.dirname(log_path), exist_ok=True)


def init_agent_logger():
    log_path = settings.AGENT_LOG_PATH
    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
    )
    logger.remove()
    check_log_file(log_path=log_path)

    # Add file logger if LOG_TO_FILE is True
    if settings.LOG_FILE_OR_CONSOLE:
        logger.add(
            log_path,
            level="ERROR",
            rotation="10 MB",
            retention="1 week",
            compression="zip",
            format=log_format,
            backtrace=True,
            diagnose=True,
        )
        
    else:
        logger.add(
            sys.stderr,
            level="ERROR",
            format=log_format,
            backtrace=True,
            diagnose=True,
        )
