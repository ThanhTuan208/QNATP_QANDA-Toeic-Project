'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { registerUser } from '@/features/auth/client/register.client'
import { type RegisterFormData, RegisterSchema } from '@/features/auth/schemas/register.schema'

export function useRegisterForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsPending(true)
    try {
      await registerUser(data)

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Đăng ký thành công nhưng đăng nhập thất bại')
        return
      }

      toast.success('Đăng ký thành công')
      form.reset()
      router.refresh()
      onSuccess?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đăng ký thất bại'
      toast.error(message)
    } finally {
      setIsPending(false)
    }
  }

  return { form, isPending, onSubmit }
}
