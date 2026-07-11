export function LandingFooter() {
  return (
    <footer className='w-full bg-card border-t border-border'>
      <div className='max-w-7xl mx-auto px-12 py-16 flex flex-col md:flex-row justify-between items-center gap-10'>
        <div className='flex flex-col items-center md:items-start gap-4'>
          <div className='text-xl font-bold text-primary tracking-tight'>TOEIC Mastery</div>
          <p className='text-sm text-muted-foreground max-w-xs text-center md:text-left opacity-70'>
            Ứng dụng học tập thông minh giúp bạn chinh phục đỉnh cao ngôn ngữ với trải nghiệm hiện
            đại.
          </p>
        </div>
        <div className='flex flex-wrap justify-center gap-10 text-sm font-semibold text-muted-foreground'>
          <span className='hover:text-primary transition-colors cursor-default'>Điều khoản</span>
          <span className='hover:text-primary transition-colors cursor-default'>Bảo mật</span>
          <span className='hover:text-primary transition-colors cursor-default'>Hỗ trợ</span>
          <span className='hover:text-primary transition-colors cursor-default'>Tuyển dụng</span>
        </div>
        <div className='text-sm text-muted-foreground opacity-60'>
          &copy; 2024 TOEIC Mastery. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
