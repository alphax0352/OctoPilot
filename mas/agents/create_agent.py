from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import tool
from langchain.output_parsers.openai_functions import JsonOutputFunctionsParser
from mas.config import logger


def create_agent(
    llm: ChatOpenAI,
    tools: list[tool],
    system_message: str
) -> AgentExecutor:
    """
    Create an agent with the given language model, tools, system message, and team members.
    
    Parameters:
        llm (ChatOpenAI): The language model to use for the agent.
        tools (list[tool]): A list of tools the agent can use.
        system_message (str): A message defining the agent's role and tasks.
        working_directory (str): The directory where the agent's data will be stored.
        
    Returns:
        AgentExecutor: An executor that manages the agent's task execution.
    """

    tool_names = ", ".join([tool.name for tool in tools])
    system_prompt = (
        "You are a specialized AI assistant in a data analysis team. "
        "Your role is to complete specific tasks in the research process. "
        "Use the provided tools to make progress on your task. "
        "If you can't fully complete a task, explain what you've done and what's needed next. "
        "Always aim for accurate and clear outputs. "
        f"You have access to the following tools: {tool_names}. "
        f"Your specific role: {system_message}\n"
        "Work autonomously according to your specialty, using the tools available to you. "
        "Do not ask for clarification. "
        "Your other team members (and other teams) will collaborate with you based on their specialties. "
        "Use the ListDirectoryContents tool to check for updates in the directory contents when needed."
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="messages"),
        ("ai", "hypothesis: {hypothesis}"),
        ("ai", "process: {process}"),
        ("ai", "process_decision: {process_decision}"),
        ("ai", "visualization_state: {visualization_state}"),
        ("ai", "searcher_state: {searcher_state}"),
        ("ai", "code_state: {code_state}"),
        ("ai", "report_section: {report_section}"),
        ("ai", "quality_review: {quality_review}"),
        ("ai", "needs_revision: {needs_revision}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    agent = create_openai_functions_agent(llm=llm, tools=tools, prompt=prompt)

    return AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, verbose=False)


def create_supervisor(llm: ChatOpenAI, system_prompt: str) -> AgentExecutor:
    logger.info("Creating supervisor")
    options = ["FINISH"]
    function_def = {
        "name": "route",
        "description": "Select the next role and assign a task.",
        "parameters": {
            "title": "routeSchema",
            "type": "object",
            "properties": {
                "next": {
                    "title": "Next",
                    "anyOf": [
                        {"enum": options},
                    ],
                },
                "task": {
                    "title": "Task",
                    "type": "string",
                    "description": "The task to be performed by the selected agent"
                }
            },
            "required": ["next", "task"],
        },
    }
    
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="messages"),
            (
                "system",
                "Given the conversation above, who should act next? "
                "Or should we FINISH? Select one of: {options}. "
                "Additionally, specify the task that the selected role should perform."
            ),
        ]
    ).partial(options=str(options))
    
    logger.info("Supervisor created successfully")
    
    return (
        prompt
        | llm.bind_functions(functions=[function_def], function_call="route")
        | JsonOutputFunctionsParser()
    )