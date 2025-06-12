import os
from dotenv import load_dotenv
from .parse import parse_job_description
from .knowledgebase.index import init_knowledgebase
from .langchain_rag_based import resumeGenerater_Langchain_RAG_based


class AutoResumeBuilder:
    def __init__(self):
        load_dotenv()
        self.knowledgebases = init_knowledgebase()
        self.parsedJobDescription = ""
        self.currentJobDescription = ""
        self.currentResult = {}

    def generate(self, jobDescription, metadata="New Job"):
        inputJobDescription = ""
        if os.path.exists(jobDescription):
            with open(jobDescription, "r", encoding="utf-8") as f:
                inputJobDescription = f.read()
        else:
            inputJobDescription = jobDescription

        self.parsedJobDescription = parse_job_description(inputJobDescription)
        self.currentResult = resumeGenerater_Langchain_RAG_based(
            self.parsedJobDescription, self.knowledgebases
        )
        return [self.parsedJobDescription, self.currentResult]
