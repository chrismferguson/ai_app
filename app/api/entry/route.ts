import { update } from '@/utils/actions'
import { getUserFromClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  const data = await request.json()
  const user = await getUserFromClerkID()
  const entry = await prisma.journalEntry.create({
    data: {
      content: data.content,
      user: {
        connect: {
          id: user.id,
        },
      },
      analysis: {
        create: {
          mood: 'Neutral',
          subject: 'None',
          burnout: false,
          summary: 'None',
          color: '#0101fe',
          userId: user.id,
        },
      },
    },
  })

  update(['/journal'])

  return NextResponse.json({ data: entry })
}