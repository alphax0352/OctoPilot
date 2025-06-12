from pydantic import BaseModel

class QuestionAnswer(BaseModel):
    type: str
    main_question: str
    subquestions: list[str]
    answer: str


class Answer(BaseModel):
    content: QuestionAnswer