import { OpenAI } from "openai";
import {
  generatedContentSchema,
  extractedContentSchema,
  coverLetterSchema,
  ExtractedContent,
  CoverLetter,
  ProfileData,
  EducationInfo,
  EmploymentHistory,
} from "@/types/server";
import { zodResponseFormat } from "openai/helpers/zod";
import { AxiosInstanceFlask } from "./axios-instance";

export async function extractContent(
  jobDescription: string,
): Promise<ExtractedContent> {
  const extractor = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const whatToExtract = ["Job Title", "Company Name", "Job Description"];

  const extractorSystemPrompt = `
  [Role]
  You are an expert job analyzer specializing in extracing required informations from the full job descriptions.
  
  [Task]
  Your task is to extract the following information from the job description: ${whatToExtract.join(
    ", ",
  )}.

  [Instructions]
  1. Job Title:
     - Extract the job title from the job description.
     - Only include the job role in the job title.
     - Do not add extra details such as team names, departments, or job descriptions.
       - Example: "Senior Full Stack Engineer", "Senior Software Engineer"
       - Avoid: "Senior Software Engineer - Backend Team", "Senior Full Stack Engineer (Remote)"
  2. Company Name:
     - Extract the company name from the job description.
  3. Job Description:
     - Extract the job description from the job description.
     - Do not tailor the job description, just extract it as it is.
     - Beautify the job description with markdown.
     - Do not include any other text or explanations.
     - Do not include the job title and company name in the job description.

  [Warnings]
  - Output only the content for the placeholders: Job Title, Company Name, Job Description.
  - Do not include explanations, additional text, or generic statements.
  - Avoid repetition of terms, phrases, or sentences.
  - Use clear, straightforward language; avoid complex or overly elaborate wording.
  `;

  const extractorPrompt = `Extract ${whatToExtract.join(
    ", ",
  )} based on the job description. Here is the job description: ${jobDescription}`;

  try {
    const completion = await extractor.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        { role: "system", content: extractorSystemPrompt },
        { role: "user", content: extractorPrompt },
      ],
      response_format: zodResponseFormat(
        extractedContentSchema,
        "extracted_content",
      ),
    });

    const extractorContent = completion.choices[0].message.parsed;

    if (!extractorContent) {
      throw new Error("No content received from OpenAI for job analyzer.");
    }

    return extractorContent;
  } catch (error) {
    console.error("Error extracting content:", error);
    return {
      title: "",
      company: "",
      description: "",
    };
  }
}

export async function generateResume(
  jobDescription: string,
  jobTitle: string,
  companyName: string,
  profileData: ProfileData,
  employmentHistory: EmploymentHistory[],
  educationInfo: EducationInfo,
  systemPrompt: string,
  resumeTemplatePath: string,
): Promise<string> {
  const generator = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const resumePlaceholders = [
    "Headline",
    "Summary",
    "Skills",
    "15 Accomplishment Bullet Points",
  ];

  const resumeWriterSystemPrompt = systemPrompt;
  const resumeWriterPrompt = `Generate ${resumePlaceholders.join(
    ", ",
  )} based on the job description. Here is the job description: ${jobDescription}`;

  try {
    const completion = await generator.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        { role: "system", content: resumeWriterSystemPrompt },
        { role: "user", content: resumeWriterPrompt },
      ],
      response_format: zodResponseFormat(
        generatedContentSchema,
        "generated_content",
      ),
    });

    const resumeContent = completion.choices[0].message.parsed;

    if (!resumeContent) {
      throw new Error("No content received from OpenAI for resume writer.");
    }

    // console.log("Request body:", {
    //   profile_data: JSON.stringify(profileData),
    //   employment_history: JSON.stringify(employmentHistory),
    //   education_info: JSON.stringify(educationInfo),
    //   resume_content: JSON.stringify(resumeContent),
    //   job_title: jobTitle,
    //   resume_template_path: resumeTemplatePath,
    // });

    const response = await AxiosInstanceFlask.post("/build_resume", {
      profile_data: JSON.stringify(profileData),
      employment_history: JSON.stringify(employmentHistory),
      education_info: JSON.stringify(educationInfo),
      resume_content: JSON.stringify(resumeContent),
      job_title: jobTitle,
      company_name: companyName,
      resume_template_path: resumeTemplatePath,
    });

    return response.data.pdf_path;
  } catch (error) {
    console.error("Error generating content:", error);
    return "";
  }
}

export async function generateCoverLetter(
  jobDescription: string,
  systemPrompt: string,
): Promise<CoverLetter> {
  const generator = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const coverLetterSystemPrompt = systemPrompt;
  const coverLetterPrompt = `Generate a cover letter based on the job description. Here is the job description: ${jobDescription}`;

  try {
    const completion = await generator.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        { role: "system", content: coverLetterSystemPrompt },
        { role: "user", content: coverLetterPrompt },
      ],
      response_format: zodResponseFormat(coverLetterSchema, "cover_letter"),
    });

    const coverLetterContent = completion.choices[0].message.parsed;

    if (!coverLetterContent) {
      throw new Error("No content received from OpenAI for cover letter.");
    }

    return coverLetterContent;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return {
      coverLetter: "",
    };
  }
}
