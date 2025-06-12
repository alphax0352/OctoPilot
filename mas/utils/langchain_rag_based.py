from typing import Literal
from pydantic import BaseModel

from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import PromptTemplate

# from langchain_core.pydantic_v1 import BaseModel, Field
import pydantic
import tiktoken


def num_tokens_from_string(string: str, encoding_name: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens

# This is the function to generate resume
# input: parsed job description
# output: resume, elements of resume in json format exactly
# {
#     "title": "Lead Machine Learning Engineer",
#     "experience": [
#         {
#             "title": "Senior Machine Learning Engineer",
#             "achievements": [
#                 "Led and mentored ...",
#                 "Deployed more than ..."
#             ]
#         },
#         {
#             "title": "Junior Machine Learning Engineer",
#             "achievements": [
#                 "blah blah",
#                 "blah blah"
#             ]z
#         }
#     ],
#     "skills": [
#         "Python",
#         "React",
#         "..."
#     ]
# }


class ExperienceSchema(BaseModel):
    job_title: str
    achievements: list[str]


class ExperiencesSchema(BaseModel):
    content: list[ExperienceSchema]


class SkillSchema(BaseModel):
    content: list[str]


# class ResumeSchema(BaseModel):
#     title: str
#     summary: str = Field(description="2~3 short sentences that can show the abilities and skills compactly.")
#     experience: list[ExperienceSchema]
#     skills: list[str]


def resumeGenerater_Langchain_RAG_based(
    parsedJobDescription,
    knowledgebases,
    categoriesNum=5,
    skillsNum=10,
    achievementsNum=10,
):
    ###### Retrieve skills first
    achievementsVDB, categoriesVDB, skillsVDB = knowledgebases

    # Chain approach

    # skillRetrievePromptTemplate = """You are a helpful assistant. I'm goint to ask you what are the skills needed.
    # You answer the question based on the following information. Skill numbers should be between 31 and 35.
    # You should answer only the skills related Information Technology. Not answer like Bachelor's degree or English proficiency.
    # Required skills: """ + ", ".join(parsedJobDescription.skills.required) + """
    # Required skills must be included in your answer.
    # Preferred skills: """ + ", ".join(parsedJobDescription.skills.preferred) + """
    # At least 80% of preferred skills should be included at the end of your answer.
    # You should use this information about this basic knowledge.
    # {context}
    # Question: Tell me required skills for this position. Responsibilities for this position are {question}

    # Helpful Answer:
    # """

    # skillRetrievePrompt = PromptTemplate.from_template(skillRetrievePromptTemplate)
    # skillsRetrieveLLM = ChatOpenAI(model="gpt-4o-mini-2024-07-18", temperature=0).with_structured_output(SkillSchema, method="json_mode")
    # skillRetriever = RunnableLambda(knowledgebases[1].similarity_search).bind(k=skillRetrieveNum)
    # skillsRagChain = (
    #     {"context": skillRetriever, "question": RunnablePassthrough()}
    #     | skillRetrievePrompt
    #     | skillsRetrieveLLM
    #     | StrOutputParser()
    # )
    # skillsRetrieveQuestion = "\n".join(parsedJobDescription.responsibilities)
    # skillsRetrieved = skillsRagChain.invoke(skillsRetrieveQuestion)

    categoriesRetriever = RunnableLambda(categoriesVDB.similarity_search).bind(
        k=categoriesNum
    )
    skillsRetriever = RunnableLambda(skillsVDB.similarity_search).bind(k=skillsNum)
    achievementsRetriever = RunnableLambda(achievementsVDB.similarity_search).bind(
        k=achievementsNum
    )

    ## Chat approach

    # Total: 120K tokens
    # 2K tokens: categoriesContext
    # 4K tokens: skillsContext

    client = OpenAI()
    responsibilities = "\n".join(parsedJobDescription.responsibilities)
    responsibilitiesAndRequiredSkills = (
        responsibilities + "\n" + ", ".join(parsedJobDescription.skills.required)
    )
    categoriesContext = categoriesRetriever.invoke(responsibilities)
    skillsContext = skillsRetriever.invoke(responsibilitiesAndRequiredSkills)
    skillsRetrieved = (
        client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a helpful assistant. I'm going to ask you what are the skills needed. 
                Inputs are Job Title, Responsibilities, Required Skills, Preferred Skills.
                Follow these instructions.
                1. Genereate 50 skills to be a strong match for this job.
                2. Each element only contains technology or skill name. Not mention like '1. '.
                3. Pay attention to job title and select relevant skills to it.
                4. Skills related to Information Technology should be before soft skills (e.g. Problem solving, Attention to detail, etc).
                5. Never repeat same technology or skill. Each technology or skill should be one word.
                6. Required skills should be included in your answer. 
                7. At least 80% of preferred skills should be included at the end of your answer.
                8. You should reference this basic knowledge. """
                    + "\n".join([x.page_content for x in categoriesContext])
                    + """
                9. You should reference these typical technologies and skills."""
                    + "\n".join([x.page_content for x in skillsContext]),
                },
                {
                    "role": "user",
                    "content": f"""
                Question:
                Job Title:"""
                    + "\n"
                    + parsedJobDescription.title
                    + """
                Responsibilities:"""
                    + "\n"
                    + responsibilities
                    + """
                Required skills:"""
                    + "\n"
                    + ", ".join(parsedJobDescription.skills.required)
                    + """ 
                Preferred skills:"""
                    + "\n"
                    + ", ".join(parsedJobDescription.skills.preferred)
                    + f""" 
                Answer: 
                
                """,
                },
            ],
            response_format=SkillSchema,
        )
        .choices[0]
        .message.parsed.content
    )

    ###### Retrieves experiences Second

    # Chat approach
    # 120K tokens
    # 2K tokens: categoriesContext
    # 100 * achievementNum

    experiencesRetrieveQuestion = (
        "Responsibilities: \n"
        + "\n".join(parsedJobDescription.responsibilities)
        + "\n\n"
        + "Required skills are: \n"
        + "\n".join(skillsRetrieved)
        + "\n"
    )
    experiencesRetrieveQuestionGroup = [
        x for x in parsedJobDescription.responsibilities
    ]
    experiencesRetrieveQuestionGroup.append(experiencesRetrieveQuestion)
    achievementsContext = achievementsRetriever.batch(experiencesRetrieveQuestionGroup)
    achievementsRetrieved = (
        client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a helpful assistant. I'm going to ask you what are the skills needed. 
                Input is Job Description.
                Follow these instructions.
                1. Generate achievements and titles for three different periods. 
                2. In each period, there should be 6~7 achievements.
                3. Each achievement should be fit for level. For example, in first period--beginner level, or second period--junior level, achievements' levels shuold be junior. Also in third period--senior level, achievements' levels should be senior.
                4. Each achievement should contain around 120 or 240 or 360 letters.
                5. Contain numerical measures as many as possible. But please avoid exaggerated measures like 99.99%, more than 30 times, etc.
                6. Use powerful expressions in achievements like led, managed, be responsible for, etc.
                7. At least last title should be similar or the same as """
                    + parsedJobDescription.title
                    + """
                8. You should not repeat same phrases or achievements.
                9. You should reference this basic knowledge."""
                    + categoriesContext[0].page_content
                    + """
                10. You should  reference these sample achievements.
                """
                    + "\n".join(
                        [x.page_content for y in achievementsContext for x in y]
                    )
                    + """
                11. You couldn't copy the sample achievements. Please refactor them creatively and accordingly. Sometimes you can merge two relevantly..
                """,
                },
                {
                    "role": "user",
                    "content": f"""
                Question: 
                Job Description:
                {experiencesRetrieveQuestion}
                Answer: 
                
                """,
                },
            ],
            response_format=ExperiencesSchema,
        )
        .choices[0]
        .message.parsed.content
    )

    ###### Summary
    summaryRetreived = (
        client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a helpful assistant. Please make a summary for a job seeker in three sentences. 
                Input is experiences - job title and achievements in that role.
                Follow these instructions.
                1. Summary is not your biography. It is to show your abilities briefly.
                2. Write in 2 sentences.
                3. Each sentence should be very impressive that can show main skills relevant to responsibilities given. 
                4. Each sentence should contain less than 15 words.
                5. Focus on last job title and responsibilities.
                6. You should reference this basic knowledge.
                {categoriesContext[0].page_content}
                7. You should reference these sample summaries. 
                    Summary 1: 
                    Senior Front End Engineer with 10 years of experience in shipping web solutions used by millions of users across various industries. 
                    Proficient in leading, mentoring team members, developing, deploying, testing web applications, communication and collaboration.
                    Deep understanding of UI/UX, user psychology, back end development, API integration and Artificial Intelligence.
                    
                    Summary 2: 
                    Accomplished Senior Frontend Engineer with a Bachelor’s in Computer Science and 7+ years of experience in web development.
                    Expert in React, Angular, and Vue.js with a strong proficiency in DevOps practices. Proven track record in leading a team as CTO,
                    and developing Web3 gaming and E-commerce platforms. Committed to delivering high-quality and scalable frontend solutions
                """,
                },
                {
                    "role": "user",
                    "content": f"""
                Question: 
                Responsibilities:
                """
                    + "\n".join(parsedJobDescription.responsibilities)
                    + """
                Experiences:
                """
                    + "\n\n".join(
                        [
                            "Job Title: "
                            + x.job_title
                            + "\n"
                            + "Achievements: \n"
                            + "\n".join(x.achievements)
                            for x in achievementsRetrieved
                        ]
                    )
                    + """
                Answer: 
                
                """,
                },
            ],
        )
        .choices[0]
        .message.content
    )

    # experienceRetrievePrompt =

    # experience_chain = (
    #     {"context": retrievers | format_docs, "question": RunnablePassthrough()}
    #     | experience_retrieve_prompt
    #     | llm
    #     | StrOutputParser()
    # )

    return [skillsRetrieved, achievementsRetrieved, summaryRetreived]
