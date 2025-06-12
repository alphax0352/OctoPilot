from langgraph.graph import StateGraph, END, START
from langgraph.checkpoint.memory import MemorySaver
from mas.core import State
from mas.core.node import (
    agent_node,
    refiner_node,
)
from mas.core.router import (
    matcher_router, 
    classifier_router, 
    process_router
)
from mas.agents import (
    create_classifier_agent,
    create_experience_agent,
    create_skill_agent,
    create_process_agent,
    create_quality_review_agent,
    create_refiner_agent,
    create_summary_agent,
    create_merger_agent,
    create_matcher_agent
)


class WorkflowManager:
    def __init__(self, language_models):
        """
        Initialize the workflow manager with language models and working directory.

        Args:
            language_models (dict): Dictionary containing language model instances
        """
        self.language_models = language_models
        self.workflow = None
        self.memory = None
        self.graph = None
        self.members = ["Classifier", "Process", "Experience", "Summary", "Skill", "Merger", "QualityReview", "Refiner"]
        self.agents = self.create_agents()
        self.setup_workflow()

    def create_agents(self):
        """Create all system agents"""
        # Get language models
        llm = self.language_models["llm"]
        power_llm = self.language_models["power_llm"]
        json_llm = self.language_models["json_llm"]

        # Create agents dictionary
        agents = {}

        # Create each agent using their respective creation functions
        agents["classifier_agent"] = create_classifier_agent(llm)
        agents["process_agent"] = create_process_agent(power_llm)
        agents["experience_agent"] = create_experience_agent(llm)
        agents["skill_agent"] = create_skill_agent(power_llm)
        agents["summary_agent"] = create_summary_agent(llm)
        agents["quality_review_agent"] = create_quality_review_agent(llm)
        agents["matcher_agent"] = create_matcher_agent(llm)
        agents["merger_agent"] = create_merger_agent(json_llm)
        agents["refiner_agent"] = create_refiner_agent(power_llm)
        
        return agents

    def setup_workflow(self):
        """Set up the workflow graph"""
        self.workflow = StateGraph(State)

        # Add nodes
        self.workflow.add_node("Classifier", lambda state: agent_node(state, self.agents["classifier_agent"], "classifier_agent"))
        self.workflow.add_node("Process",lambda state: agent_node(state, self.agents["process_agent"], "process_agent"))
        self.workflow.add_node("Experience",lambda state: agent_node(state, self.agents["experience_agent"], "experience_agent"))
        self.workflow.add_node("Skill",lambda state: agent_node(state, self.agents["skill_agent"], "skill_agent"))
        self.workflow.add_node("Summary",lambda state: agent_node(state, self.agents["summary_agent"], "summary_agent"))
        self.workflow.add_node("QualityReview",lambda state: agent_node(state, self.agents["quality_review_agent"], "quality_review_agent"))
        self.workflow.add_node("Matcher",lambda state: agent_node(state, self.agents["matcher_agent"], "matcher_agent"))
        self.workflow.add_node("Merger",lambda state: agent_node(state, self.agents["merger_agent"], "merger_agent"))
        self.workflow.add_node("Refiner",lambda state: refiner_node(state, self.agents["refiner_agent"], "refiner_agent"))

        # Add edges
        self.workflow.add_edge(START, "Classifier")
        self.workflow.add_edge("Classifier", "QualityReview")

        self.workflow.add_conditional_edges(
            "QualityReview",
            classifier_router,
            {"Classifier": "Classifier", "Process": "Process"},
        )

        self.workflow.add_conditional_edges(
            "Process",
            process_router,
            {
                "Summary": "Summary",
                "Skill": "Skill",
                "Experience": "Experience",
                "Merger": "Merger",
                "Process": "Process",
                "Refiner": "Refiner",
            },
        )

        for member in ["Summary", "Skill", "Experience"]:
            self.workflow.add_edge(member, "QualityReview")

        self.workflow.add_conditional_edges(
            "QualityReview",
            matcher_router,
            {
                "Summary": "Summary",
                "Skill": "Skill",
                "Experience": "Experience",
                "Merger": "Merger"
            },
        )

        self.workflow.add_edge("Merger", "Process")
        self.workflow.add_edge("Refiner", "Matcher")

        self.workflow.add_conditional_edges(
            "Matcher",
            lambda state: (
                "Process" if state and state.get("needs_revision", False) else "END"
            ),
            {"Process": "Process", "END": END},
        )

        # Compile workflow
        self.memory = MemorySaver()
        self.graph = self.workflow.compile()

    def get_graph(self):
        """Return the compiled workflow graph"""
        return self.graph
