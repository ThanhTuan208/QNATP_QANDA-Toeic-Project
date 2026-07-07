import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: 'Email là bắt buộc' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: 'Email đã được đăng ký' }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: { name: name || null, email },
    })

    return NextResponse.json({ id: user.id, email: user.email })
  } catch {
    return NextResponse.json({ message: 'Đăng ký thất bại' }, { status: 500 })
  }
}
