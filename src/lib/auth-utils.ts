import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getUserId(): Promise<string> {
  const session = await auth()
  if (session?.user?.id) return session.user.id

  const dev = await prisma.user.upsert({
    where: { email: 'dev@toeic.local' },
    update: {},
    create: { email: 'dev@toeic.local', name: 'Dev User' },
  })
  return dev.id
}
