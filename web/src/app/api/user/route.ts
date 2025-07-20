import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/../prisma/client'
import { User } from '@/types/server'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  const session = await getUser()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')

  try {
    const users = (await prisma.user.findMany({
      where: {
        id: { not: session.user.id },
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        lastActiveAt: true,
      },
    })) as User[]

    return NextResponse.json(users)
  } catch (err) {
    console.error('💥Error while fetching users', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE() {
  const session = await getUser()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.account.deleteMany({
        where: { userId: session.user.id },
      })
      await tx.session.deleteMany({
        where: { userId: session.user.id },
      })
      await tx.application.deleteMany({
        where: { userId: session.user.id },
      })
      await tx.user.deleteMany({
        where: { id: session.user.id },
      })
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('💥Error while fetching users', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
