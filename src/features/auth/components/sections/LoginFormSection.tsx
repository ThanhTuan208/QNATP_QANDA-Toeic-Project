import Link from 'next/link'
import { Label } from '@/components/common/Label'
import { Button } from '@/components/ui/actions/button'

export function LoginFormSection() {
  return (
    <div className='bg-card p-8 rounded-3xl shadow-sm border border-border'>
      <h1 className='text-2xl font-bold text-center text-foreground mb-6'>Đăng nhập</h1>
      <form className='space-y-4'>
        <div>
          <Label htmlFor='login-email' className='block text-sm font-medium text-foreground mb-1'>
            Email
          </Label>
          <input
            id='login-email'
            type='email'
            className='w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='your@email.com'
          />
        </div>
        <div>
          <Label
            htmlFor='login-password'
            className='block text-sm font-medium text-foreground mb-1'
          >
            Mật khẩu
          </Label>
          <input
            id='login-password'
            type='password'
            className='w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='••••••••'
          />
        </div>
        <Button
          type='submit'
          className='w-full bg-primary text-primary-foreground py-3 hover:opacity-90'
        >
          Đăng nhập
        </Button>
      </form>
      <p className='text-center text-sm text-muted-foreground mt-6'>
        Chưa có tài khoản?{' '}
        <Link href='/register' className='text-primary font-medium hover:underline'>
          Đăng ký
        </Link>
      </p>
    </div>
  )
}
