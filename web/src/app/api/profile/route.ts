import { NextResponse } from 'next/server'
import prisma from '@/../prisma/client'
import { getUser } from '@/lib/auth'
import { EmploymentHistory } from '@/types/server'

export async function GET() {
  try {
    const session = await getUser()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const mainInfo = {
      name: user.mainInfo?.name || '',
      email: user.mainInfo?.email || '',
      phone: user.mainInfo?.phone || '',
      location: user.mainInfo?.location || '',
      linkedin: user.mainInfo?.linkedin || '',
    }

    const employmentHistory = user.employmentHistory.map((history: EmploymentHistory) => ({
      company: history.company || '',
      title: history.title || '',
      from: history.from || '',
      to: history.to || '',
      location: history.location || '',
      description: history.description || '',
      // projects: history.projects || "",
    }))

    const educationInfo = {
      school: user.educationInfo?.school || '',
      degree: user.educationInfo?.degree || '',
      from: user.educationInfo?.from || '',
      to: user.educationInfo?.to || '',
      location: user.educationInfo?.location || '',
    }

    const resumeWriterPrompt = user.resumeWriterPrompt || ''
    const coverLetterPrompt = user.coverLetterPrompt || ''
    const resumeTemplatePath = user.resumeTemplatePath || ''

    return NextResponse.json({
      mainInfo,
      employmentHistory,
      educationInfo,
      resumeWriterPrompt,
      coverLetterPrompt,
      resumeTemplatePath,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getUser()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      mainInfo,
      employmentHistory,
      educationInfo,
      resumeWriterPrompt,
      coverLetterPrompt,
      resumeTemplatePath,
    } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update or create main info
    if (mainInfo) {
      await prisma.mainInfo.upsert({
        where: { userId: user.id },
        update: mainInfo,
        create: { ...mainInfo, userId: user.id },
      })
    }

    // Update or create education info
    if (educationInfo) {
      await prisma.educationInfo.upsert({
        where: { userId: user.id },
        update: educationInfo,
        create: { ...educationInfo, userId: user.id },
      })
    }

    // Update employment history
    if (employmentHistory) {
      // Delete existing employment history
      await prisma.employmentHistory.deleteMany({
        where: { userId: user.id },
      })

      // Create new employment history entries
      await prisma.employmentHistory.createMany({
        data: employmentHistory.map((item: EmploymentHistory) => ({
          ...item,
          userId: user.id,
        })),
      })
    }

    // Update user settings
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resumeWriterPrompt,
        coverLetterPrompt,
        resumeTemplatePath,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
