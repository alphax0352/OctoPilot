import { NextResponse } from 'next/server'
import prisma from '@/../prisma/client'
import { getUser } from '@/lib/auth'
import { extractContent, generateResume, generateCoverLetter } from '@/lib/vilder'
import { decodeBase64 } from '@/lib/base64'
import { CoverLetter, EducationInfo, EmploymentHistory, ProfileData } from '@/types/server'
import { renderString } from '@/lib/render-string'

export async function POST(req: Request) {
  try {
    const session = await getUser()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobDescription, generateOptions } = await req.json()
    const decodedJobDescription = decodeBase64(jobDescription)

    if (!decodedJobDescription || !generateOptions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { resume, coverLetter, ignoreConflicts } = generateOptions
    let resumePath: string | null = null
    let coverLetterContent: CoverLetter | null = null

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        mainInfo: true,
        employmentHistory: true,
        educationInfo: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if any mainInfo fields are empty
    if (
      !user.mainInfo ||
      !user.mainInfo.name ||
      !user.mainInfo.location ||
      !user.mainInfo.email ||
      // !user.mainInfo.phone ||
      !user.mainInfo.linkedin
    ) {
      return NextResponse.json(
        { error: 'Please complete your profile information in settings' },
        { status: 400 }
      )
    }

    // Check if employment history is empty
    if (user.employmentHistory.length === 0) {
      return NextResponse.json(
        { error: 'Please add your employment history in settings' },
        { status: 400 }
      )
    }

    // Check if any employment history entries have empty fields
    const hasIncompleteEmployment = user.employmentHistory.some(
      (history: EmploymentHistory) =>
        !history.company ||
        !history.title ||
        !history.from ||
        !history.to ||
        !history.location ||
        !history.description
      // !history.projects
    )

    if (hasIncompleteEmployment) {
      return NextResponse.json(
        { error: 'Please complete all employment history fields in settings' },
        { status: 400 }
      )
    }

    // Check if education info fields are empty
    if (
      !user.educationInfo.school ||
      !user.educationInfo.degree ||
      !user.educationInfo.from ||
      !user.educationInfo.to ||
      !user.educationInfo.location
    ) {
      return NextResponse.json(
        { error: 'Please complete your education information in settings' },
        { status: 400 }
      )
    }

    const { resumeWriterPrompt, coverLetterPrompt } = user

    if (!resumeWriterPrompt || !coverLetterPrompt) {
      return NextResponse.json(
        { error: 'Please complete your prompts in settings' },
        { status: 400 }
      )
    }

    if (!user.resumeTemplatePath) {
      return NextResponse.json(
        { error: 'Please upload a resume template in settings' },
        { status: 400 }
      )
    }

    const resumeTemplatePath = process.env.RESUME_BASE_PATH! + user.resumeTemplatePath

    const profileData = {
      name: user.mainInfo.name,
      location: user.mainInfo.location,
      email: user.mainInfo.email,
      phone: user.mainInfo.phone,
      linkedin: user.mainInfo.linkedin,
    } as ProfileData

    const employmentHistory = user.employmentHistory.map((history: EmploymentHistory) => ({
      company: history.company,
      title: history.title,
      from: history.from.slice(0, 7),
      to: history.to.slice(0, 7),
      location: history.location,
      description: history.description,
      // projects: history.projects,
    }))

    const educationInfo = {
      school: user.educationInfo.school,
      degree: user.educationInfo.degree,
      from: user.educationInfo.from.slice(0, 7),
      to: user.educationInfo.to.slice(0, 7),
      location: user.educationInfo.location,
    } as EducationInfo

    const resumePlaceholders = ['Headline', 'Summary', 'Skills', '15 Accomplishment Bullet Points']

    const resumeWriter = renderString(resumeWriterPrompt, {
      resumePlaceholders,
      employmentHistory,
    })

    const coverLetterWriter = renderString(coverLetterPrompt, {
      name: profileData.name,
      employmentHistory,
    })

    const extractedContent = await extractContent(decodedJobDescription)

    if (!ignoreConflicts) {
      const exitingApplication = await prisma.application.findFirst({
        where: {
          userId: session.user.id,
          company: extractedContent.company,
        },
      })

      if (exitingApplication) {
        return NextResponse.json(
          {
            resumePath: exitingApplication.resumePath.replaceAll('\\', '/'),
            message: 'Application already exists for this company',
          },
          { status: 202 }
        )
      }
    }

    if (resume) {
      resumePath = await generateResume(
        decodedJobDescription,
        extractedContent.title,
        extractedContent.company,
        profileData,
        employmentHistory,
        educationInfo,
        resumeWriter,
        resumeTemplatePath
      )
    }

    if (coverLetter) {
      coverLetterContent = await generateCoverLetter(decodedJobDescription, coverLetterWriter)
    }

    if (!extractedContent || (resume && !resumePath) || (coverLetter && !coverLetterContent)) {
      return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
    }

    await prisma.application.create({
      data: {
        userId: session.user.id,
        title: extractedContent.title,
        company: extractedContent.company,
        description: extractedContent.description,
        resumePath: resumePath || null,
        coverLetter: coverLetterContent?.coverLetter || null,
      },
    })

    return NextResponse.json({
      resumePath: resumePath?.replaceAll('\\', '/'),
      coverLetter: coverLetterContent?.coverLetter,
    })
  } catch (error) {
    console.error('💥Error while generating content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
