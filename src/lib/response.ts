import { NextResponse } from 'next/server'

export function success<T>(data: T, message = 'Success') {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

export function paginated<T>(data: T[], total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export function error(message: string, status = 400, code?: string) {
  return NextResponse.json({ success: false, message, code }, { status })
}
