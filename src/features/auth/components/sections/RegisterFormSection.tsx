import Link from 'next/link'
import { Button } from '@/components/ui/actions/button'

export function RegisterFormSection() {
  return (
    <div className='bg-card p-8 rounded-3xl shadow-sm border border-border'>
      <h1 className='text-2xl font-bold text-center text-foreground mb-6'>Đăng ký</h1>
      <form className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-foreground mb-1'>Họ tên</label>
          <input
            type='text'
            className='w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='Nguyễn Văn A'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-foreground mb-1'>Email</label>
          <input
            type='email'
            className='w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='your@email.com'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-foreground mb-1'>Mật khẩu</label>
          <input
            type='password'
            className='w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='••••••••'
          />
        </div>
        <Button
          type='submit'
          className='w-full bg-primary text-primary-foreground py-3 hover:opacity-90'
        >
          Đăng ký
        </Button>
      </form>
      <p className='text-center text-sm text-muted-foreground mt-6'>
        Đã có tài khoản?{' '}
        <Link href='/login' className='text-primary font-medium hover:underline'>
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
