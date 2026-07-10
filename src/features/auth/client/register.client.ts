import type { RegisterInput } from '@/features/auth/types'

export async function registerUser(data: RegisterInput): Promise<{ id: string; email: string }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Đăng ký thất bại' }))
    throw new Error(err.message || 'Đăng ký thất bại')
  }

  return res.json()
}
