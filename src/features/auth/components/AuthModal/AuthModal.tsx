'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/navigation/tabs'
import { Dialog, DialogContent } from '@/components/ui/overlay/dialog'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  activeTab: 'login' | 'register'
  onTabChange: (tab: 'login' | 'register') => void
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  activeTab,
  onTabChange,
}: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[calc(100%-32px)] gap-0 sm:max-w-md p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-card max-h-[90vh] overflow-y-auto'>
        <div className='bg-gradient-to-br from-green-teal-5 via-green-teal-10 to-card p-6 sm:p-8 pb-4 relative shrink-0'>
          <div className='text-left space-y-0 text-foreground'>
            <h2 className='text-2xl sm:text-[26px] font-bold tracking-tight leading-tight pt-2'>
              {activeTab === 'login' ? 'Chào mừng bạn quay lại' : 'Tạo tài khoản mới'}
            </h2>
            <p className='text-sm sm:text-[15px] font-medium text-muted-foreground mt-1 sm:mt-2 pr-10 leading-relaxed'>
              {activeTab === 'login'
                ? 'Đăng nhập để theo dõi tiến độ học tập.'
                : 'Đăng ký để lưu lịch sử luyện tập.'}
            </p>
          </div>

          <Button
            onClick={onClose}
            className='absolute top-4 sm:top-5 right-4 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-card shadow-sm border border-border text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95 z-20'
          >
            <X className='w-4 h-4 sm:w-5 sm:h-5' strokeWidth={2.5} />
          </Button>
        </div>

        <div className='px-5 sm:px-8 pb-6 sm:pb-10'>
          <Tabs
            value={activeTab}
            onValueChange={(v) => onTabChange(v as 'login' | 'register')}
            className='w-full flex flex-col'
          >
            <TabsList className='grid w-full grid-cols-2 p-1.5 bg-muted rounded-[20px] h-12 sm:h-14 mb-5 mt-5 sm:mb-6'>
              <TabsTrigger
                value='login'
                className='rounded-[16px] font-bold text-sm h-full transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground'
              >
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger
                value='register'
                className='rounded-[16px] font-bold text-sm h-full transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground'
              >
                Đăng ký
              </TabsTrigger>
            </TabsList>

            <TabsContent value='login' className='outline-none focus-visible:ring-0 w-full mt-0'>
              <LoginForm onSuccess={onSuccess} />
            </TabsContent>

            <TabsContent value='register' className='outline-none focus-visible:ring-0 w-full mt-0'>
              <RegisterForm onSuccess={onSuccess} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
