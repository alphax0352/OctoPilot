from langchain_core.messages import HumanMessage
from mas.config import logger
from mas.core import (
    WorkflowManager,
    LanguageModelManager
)


class MASManager:
    def __init__(self):
        self.logger = logger
        self.lm_manager = LanguageModelManager()
        self.workflow_manager = WorkflowManager(
            language_models=self.lm_manager.get_models()
        )


    def run(self, user_input: str) -> None:
        """Run the multi-agent system with user input"""
        graph = self.workflow_manager.get_graph()
        events = graph.stream(
            {
                "messages": [HumanMessage(content=user_input)],
                "hypothesis": "",
                "process_decision": "",
                "process": "",
                "summary_state": "",
                "skill_state": "",
                "experience_state": "",
                "quality_review": "",
                "needs_revision": False,
                "last_sender": "",
            },
            {"configurable": {"thread_id": "1"}, "recursion_limit": 3000},
            stream_mode="values",
            debug=False,
        )

        for event in events:
            message = event["messages"][-1]
            if isinstance(message, tuple):
                print(message, end="", flush=True)
            else:
                message.pretty_print()
