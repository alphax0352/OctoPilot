from docx import Document
from python_docx_replace import docx_replace
from docx2pdf import convert
import json
import os

from fastapi import HTTPException


def parse_basics(basicsData):
    parsedBasics = dict()
    parsedBasics["name"] = basicsData["name"]
    parsedBasics["phone"] = basicsData["phone"]
    parsedBasics["email"] = basicsData["email"]
    parsedBasics["location"] = basicsData["location"]

    for i in range(3):
        parsedBasics[f"company{i}"] = basicsData["experience"][i]["companyName"]
        parsedBasics[f"start{i}"] = basicsData["experience"][i]["start"]
        parsedBasics[f"finish{i}"] = basicsData["experience"][i]["finish"]

    parsedBasics["university"] = basicsData["education"]["universityName"]
    parsedBasics["startu"] = basicsData["education"]["start"]
    parsedBasics["finishu"] = basicsData["education"]["finish"]

    return parsedBasics


def parse_generated(generatedData):
    skillsGenerated, achievementsGenerated, summaryGenerated = generatedData
    parsedGenerated = dict()

    parsedGenerated["title"] = achievementsGenerated[2].job_title
    parsedGenerated["summary"] = summaryGenerated

    for i in range(3):
        parsedGenerated[f"title{i}"] = achievementsGenerated[i].job_title
        for j in range(6):
            parsedGenerated[f"achievement{i}_{j}"] = achievementsGenerated[
                i
            ].achievements[j]

    for i in range(len(skillsGenerated)):
        parsedGenerated[f"Skill{i}"] = skillsGenerated[i]

    for i in range(len(skillsGenerated), 60):
        parsedGenerated[f"Skill{i}"] = ""

    return parsedGenerated


def create_resume_document(generatedData, savedocname, savepdfname, profile, template):

    try:
        with open(profile, "r", encoding="utf-8") as f:
            basics = json.load(f)
            doc = Document(template)
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Unable to open profile and template: {str(e)}"
        )

    # Basic Information

    parsedBasics = parse_basics(basics)
    docx_replace(doc, **parsedBasics)

    # Generated Information
    parsedGenerated = parse_generated(generatedData)
    docx_replace(doc, **parsedGenerated)

    try:
        doc.save(savedocname)
        convert(savedocname, savepdfname)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unable to save resume: {str(e)}")

    return "Resume created successfully"
