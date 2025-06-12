from pydantic import BaseModel
from openai import OpenAI


class SkillSchema(BaseModel):
    required: list[str]
    preferred: list[str]


class JobDescriptionSchema(BaseModel):
    companyName: str
    title: str
    responsibilities: list[str]
    skills: SkillSchema


def parse_job_description(jobDescription):
    client = OpenAI()
    parsedJobDescription = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {
                "role": "system",
                "content": "Answer following these rules."
                "1. Extract company name first. Usually company name is around position title or presented inside description of position's benefit or company culture. Company name examples: google, microsoft, zoom, voc.ai, InfoTech Global, etc. If there's no company name, just output 'None'."
                "2. Extract position title. You should find position title from above few lines."
                "3. Extract responsibilities."
                "4. Finally extract skills. While extracting skills, you should consider the title and responsisbilities carefully and find all the technologies and soft skills relevant to them. Required skills should be at least 20 and preferred skills should be at least 15.",
            },
            {"role": "user", "content": jobDescription},
        ],
        response_format=JobDescriptionSchema,
    )

    return parsedJobDescription.choices[0].message.parsed


# parse_job_description(sampleDescription)
