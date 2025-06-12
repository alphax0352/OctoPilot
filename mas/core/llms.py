from langchain_openai import ChatOpenAI
from mas.config import logger


class LanguageModelManager:
    def __init__(self):
        """Initialize the language model manager"""
        self.logger = logger
        self.llm = None
        self.power_llm = None
        self.json_llm = None
        self.initialize_llms()

    def initialize_llms(self):
        """Initialize language models"""
        try:
            self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, max_tokens=4096)
            self.power_llm = ChatOpenAI(
                model="gpt-4o", temperature=0.5, max_tokens=4096
            )
            self.json_llm = ChatOpenAI(
                model="gpt-4o",
                model_kwargs={"response_format": {"type": "json_object"}},
                temperature=0,
                max_tokens=4096,
            )
        except Exception as e:
            self.logger.error(f"Error initializing language models: {str(e)}")
            raise

    def get_models(self):
        """Return all initialized language models"""
        return {"llm": self.llm, "power_llm": self.power_llm, "json_llm": self.json_llm}
