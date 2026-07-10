'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type LoginFormData, LoginSchema } from '@/features/auth/schemas/login.schema'

export function useLoginForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsPending(true)
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Sai email hoặc mật khẩu')
        return
      }

      toast.success('Đăng nhập thành công')
      form.reset()
      router.refresh()
      onSuccess?.()
    } catch {
      toast.error('Đăng nhập thất bại')
    } finally {
      setIsPending(false)
    }
  }

  return { form, isPending, onSubmit }
}
