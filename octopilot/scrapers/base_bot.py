from abc import ABC, abstractmethod


class BaseBot(ABC):
    def __init__(self, email, password):
        self.email = email
        self.password = password

    @abstractmethod
    async def login(self):
        pass

    @abstractmethod
    async def search_jobs(self, keywords):
        pass

    @abstractmethod
    async def get_job_descriptions(self, job_id):
        """Retrieve detailed information about a specific job posting
        
        Returns:
            dict: Job details including:
                - title: str
                - company: str
                - description: str
                - url: str
                - location: str
                - posted_date: str
        """
        pass
