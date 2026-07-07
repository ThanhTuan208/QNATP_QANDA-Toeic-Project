'use client'

import { Button } from '@/components/common/Button'
import { Form } from '@/components/common/Form'
import { FormInput } from '@/components/common/Form/FormInput'
import { FormPassword } from '@/components/common/Form/FormPassword'
import { useLoginForm } from '@/features/auth/hooks/useLoginForm'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { form, isPending, onSubmit } = useLoginForm({ onSuccess })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 sm:space-y-5'>
      <Form {...form}>
        <FormInput
          control={form.control}
          name='email'
          type='email'
          placeholder='Nhập email của bạn'
          inputClassName='h-12 sm:h-14 rounded-xl bg-muted border-border px-4 sm:px-5 text-sm text-foreground font-medium transition-all focus:bg-card'
        />

        <FormPassword
          control={form.control}
          name='password'
          placeholder='Nhập mật khẩu'
          inputClassName='h-12 sm:h-14 rounded-xl bg-muted border-border px-4 sm:px-5 text-sm text-foreground font-medium transition-all focus:bg-card'
        />

        <Button
          type='submit'
          loading={isPending}
          loadingText='Đang đăng nhập...'
          className='w-full h-12 sm:h-14 rounded-xl bg-primary text-primary-foreground font-bold text-sm sm:text-base hover:opacity-90 transition-all shadow-xl mt-2'
        >
          Đăng nhập
        </Button>
      </Form>
    </form>
  )
}
