import { ChevronRight, Globe, MessageCircle, Play } from 'lucide-react'
import { footerLinks } from '@/features/landing/constants'

export function LandingFooter() {
  return (
    <footer className='w-full border-t border-border bg-card'>
      <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 md:py-16 lg:px-12'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8 lg:gap-12'>
          <div className='flex flex-col justify-center items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='text-xl font-bold tracking-tight text-primary mr-5'>
                <span className='text-neutral-90'>LI</span>TOEIC
              </div>
              <span className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground'>
                <Globe className='h-4 w-4' />
              </span>
              <span className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground'>
                <Play className='h-4 w-4' />
              </span>
              <span className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground'>
                <MessageCircle className='h-4 w-4' />
              </span>
            </div>
            <p className='max-w-xs text-center text-sm leading-relaxed text-muted-foreground opacity-70'>
              Ứng dụng học tập thông minh giúp bạn chinh phục đỉnh cao ngôn ngữ với trải nghiệm hiện
              đại.
            </p>
          </div>

          <div className='grid grid-cols-2 px-4 gap-4 sm:gap-6 lg:gap-8'>
            <div className='text-left'>
              <h4 className='mb-3 text-sm font-bold uppercase tracking-wider text-foreground md:mb-4'>
                Lộ trình
              </h4>
              <ul className='space-y-2.5 md:space-y-3'>
                {footerLinks.routes.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className='group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary'
                    >
                      <ChevronRight className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className='text-left'>
              <h4 className='mb-3 text-sm font-bold uppercase tracking-wider text-foreground md:mb-4'>
                Hỗ trợ
              </h4>
              <ul className='space-y-2.5 md:space-y-3'>
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className='group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary'
                    >
                      <ChevronRight className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* <div className='text-center sm:text-left'>
            <h4 className='mb-3 text-sm font-bold uppercase tracking-wider text-foreground md:mb-4'>
              Pháp lý
            </h4>
            <ul className='space-y-2.5 md:space-y-3'>
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className='group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary'
                  >
                    <ChevronRight className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* <div className='mt-8 border-t border-border pt-5 text-center text-xs text-muted-foreground opacity-60 sm:text-sm md:mt-12 md:pt-8'>
          &copy; 2026 TOEIC Mastery. All rights reserved.
        </div> */}
      </div>
    </footer>
  )
}
