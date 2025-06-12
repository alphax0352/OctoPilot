from typing import Sequence, TypedDict
from pydantic import BaseModel, Field
from langchain_core.messages import BaseMessage


class State(TypedDict):
    """TypedDict for the entire state structure."""
    messages: Sequence[BaseMessage]
    hypothesis: str = ""
    process: str = ""
    process_decision: str = ""
    visualization_state: str = ""
    searcher_state: str = ""
    code_state: str = ""
    report_section: str = ""
    quality_review: str = ""
    needs_revision: bool = False
    sender: str = ""


class MergeState(BaseModel):
    """Pydantic model for the entire state structure."""

    messages: Sequence[BaseMessage] = Field(default_factory=list, description="List of message dictionaries")
    hypothesis: str = Field(default="", description="Current research hypothesis")
    process: str = Field(default="", description="Current research process")
    process_decision: str = Field(default="", description="Decision about the next process step")
    summary_state: str = Field(default="", description="Current state of data visualization")
    skill_state: str = Field(default="", description="Current state of the search process")
    exprience_state: str = Field(default="", description="Current state of code development")
    merger_state: str = Field(default="", description="Current state of code development")
    quality_review: str = Field(default="", description="Feedback from quality review")
    needs_revision: bool = Field(default=False, description="Flag indicating if revision is needed")
    sender: str = Field(default="", description="Identifier of the last message sender")

    class Config:
        arbitrary_types_allowed = (
            True  # Allow BaseMessage type without explicit validator
        )
