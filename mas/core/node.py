import json, re, os
from langchain.agents import AgentExecutor
from langchain_core.messages import AIMessage, HumanMessage, BaseMessage
from openai import InternalServerError
from pathlib import Path
from mas.core import State
from mas.config import logger

def agent_node(state: State, agent: AgentExecutor, name: str) -> State:
    """
    Process an agent's action and update the state accordingly.
    """
    logger.info(f"Processing agent: {name}")
    try:
        result = agent.invoke(state)
        logger.debug(f"Agent {name} result: {result}")

        output = (
            result["output"]
            if isinstance(result, dict) and "output" in result
            else str(result)
        )

        ai_message = AIMessage(content=output, name=name)
        state["messages"].append(ai_message)
        state["sender"] = name

        if name == "hypothesis_agent" and not state["hypothesis"]:
            state["hypothesis"] = ai_message
            logger.info("Hypothesis updated")
        elif name == "process_agent":
            state["process_decision"] = ai_message
            logger.info("Process decision updated")
        elif name == "skill_agent":
            state["visualization_state"] = ai_message
            logger.info("Visualization state updated")
        elif name == "experience_agent":
            state["searcher_state"] = ai_message
            logger.info("Searcher state updated")
        elif name == "summary_agent":
            state["report_section"] = ai_message
            logger.info("Report section updated")
        elif name == "quality_review_agent":
            state["quality_review"] = ai_message
            state["needs_revision"] = "revision needed" in output.lower()
            logger.info(
                f"Quality review updated. Needs revision: {state['needs_revision']}"
            )
        
        logger.info(f"Agent {name} processing completed")
        return state
    except Exception as e:
        logger.error(
            f"Error occurred while processing agent {name}: {str(e)}", exc_info=True
        )
        error_message = AIMessage(content=f"Error: {str(e)}", name=name)
        return {"messages": [error_message]}

def create_message(message: dict[str], name: str) -> BaseMessage:
    """
    Create a BaseMessage object based on the message type.
    """
    content = message.get("content", "")
    message_type = message.get("type", "").lower()

    logger.debug(f"Creating message of type {message_type} for {name}")
    return (
        HumanMessage(content=content)
        if message_type == "human"
        else AIMessage(content=content, name=name)
    )


def merger_agent_node(state: State, agent: AgentExecutor, name: str) -> State:
    """
    Process the note agent's action and update the entire state.
    """
    logger.info(f"Processing note agent: {name}")
    try:
        current_messages = state.get("messages", [])

        head_messages, tail_messages = [], []

        if len(current_messages) > 6:
            head_messages = current_messages[:2]
            tail_messages = current_messages[-2:]
            state = {**state, "messages": current_messages[2:-2]}
            logger.debug("Trimmed messages for processing")

        result = agent.invoke(state)
        logger.debug(f"Note agent {name} result: {result}")
        output = (
            result["output"]
            if isinstance(result, dict) and "output" in result
            else str(result)
        )
        
        cleaned_output = re.sub(r"[\x00-\x1F\x7F-\x9F]", "", output)
        parsed_output = json.loads(cleaned_output)
        logger.debug(f"Parsed output: {parsed_output}")
        
        
        new_messages = [
            create_message(msg, name) for msg in parsed_output.get("messages", [])
        ]
        
        messages = new_messages if new_messages else current_messages
        combined_messages = head_messages + messages + tail_messages
        
        updated_state: State = {
            "messages": combined_messages,
            "hypothesis": str(
                parsed_output.get("hypothesis", state.get("hypothesis", ""))
            ),
            "process": str(parsed_output.get("process", state.get("process", ""))),
            "process_decision": str(
                parsed_output.get("process_decision", state.get("process_decision", ""))
            ),
            "visualization_state": str(
                parsed_output.get(
                    "visualization_state", state.get("visualization_state", "")
                )
            ),
            "searcher_state": str(
                parsed_output.get("searcher_state", state.get("searcher_state", ""))
            ),
            "code_state": str(
                parsed_output.get("code_state", state.get("code_state", ""))
            ),
            "report_section": str(
                parsed_output.get("report_section", state.get("report_section", ""))
            ),
            "quality_review": str(
                parsed_output.get("quality_review", state.get("quality_review", ""))
            ),
            "needs_revision": bool(
                parsed_output.get("needs_revision", state.get("needs_revision", False))
            ),
            "sender": "note_agent",
        }
        
        logger.info("Updated state successfully")
        return updated_state
    
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}", exc_info=True)
        return _create_error_state(
            state,
            AIMessage(content=f"Error parsing output: {output}", name=name),
            name,
            "JSON decode error",
        )
        
    except InternalServerError as e:
        logger.error(f"OpenAI Internal Server Error: {e}", exc_info=True)
        return _create_error_state(
            state,
            AIMessage(content=f"OpenAI Error: {str(e)}", name=name),
            name,
            "OpenAI error",
        )
        
    except Exception as e:
        logger.error(f"Unexpected error in note_agent_node: {e}", exc_info=True)
        return _create_error_state(
            state,
            AIMessage(content=f"Unexpected error: {str(e)}", name=name),
            name,
            "Unexpected error",
        )


def _create_error_state(
    state: State, error_message: AIMessage, name: str, error_type: str
) -> State:
    """
    Create an error state when an exception occurs.
    """
    logger.info(f"Creating error state for {name}: {error_type}")
    error_state: State = {
        "messages": state.get("messages", []) + [error_message],
        "hypothesis": str(state.get("hypothesis", "")),
        "process": str(state.get("process", "")),
        "process_decision": str(state.get("process_decision", "")),
        "visualization_state": str(state.get("visualization_state", "")),
        "searcher_state": str(state.get("searcher_state", "")),
        "code_state": str(state.get("code_state", "")),
        "report_section": str(state.get("report_section", "")),
        "quality_review": str(state.get("quality_review", "")),
        "needs_revision": bool(state.get("needs_revision", False)),
        "sender": "note_agent",
    }
    return error_state


def refiner_node(state: State, agent: AgentExecutor, name: str) -> State:
    """
    Read MD file contents and PNG file names from the specified storage path,
    add them as report materials to a new message,
    then process with the agent and update the original state.
    If token limit is exceeded, use only MD file names instead of full content.
    """
    try:
        # Get storage path
        storage_path = Path(os.getenv("STORAGE_PATH", "./data_storage/"))
        
        # Collect materials
        materials = []
        md_files = list(storage_path.glob("*.md"))
        png_files = list(storage_path.glob("*.png"))
        
        # Process MD files
        for md_file in md_files:
            with open(md_file, "r", encoding="utf-8") as f:
                materials.append(f"MD file '{md_file.name}':\n{f.read()}")
        
        # Process PNG files
        materials.extend(f"PNG file: '{png_file.name}'" for png_file in png_files)
        
        # Combine materials
        combined_materials = "\n\n".join(materials)
        report_content = f"Report materials:\n{combined_materials}"
        
        # Create refiner state
        refiner_state = state.copy()
        refiner_state["messages"] = [BaseMessage(content=report_content)]
        
        try:
            # Attempt to invoke agent with full content
            result = agent.invoke(refiner_state)
        except Exception as token_error:
            # If token limit is exceeded, retry with only MD file names
            logger.warning("Token limit exceeded. Retrying with MD file names only.")
            md_file_names = [f"MD file: '{md_file.name}'" for md_file in md_files]
            png_file_names = [f"PNG file: '{png_file.name}'" for png_file in png_files]
            
            simplified_materials = "\n".join(md_file_names + png_file_names)
            simplified_report_content = (
                f"Report materials (file names only):\n{simplified_materials}"
            )
            
            refiner_state["messages"] = [BaseMessage(content=simplified_report_content)]
            result = agent.invoke(refiner_state)
        
        # Update original state
        state["messages"].append(AIMessage(content=result))
        state["sender"] = name
        
        logger.info("Refiner node processing completed")
        return state
    except Exception as e:
        logger.error(
            f"Error occurred while processing refiner node: {str(e)}", exc_info=True
        )
        state["messages"].append(AIMessage(content=f"Error: {str(e)}", name=name))
        return state
