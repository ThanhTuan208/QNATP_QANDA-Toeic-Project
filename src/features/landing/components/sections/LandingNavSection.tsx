import Link from 'next/link'

export function LandingNavSection() {
  return (
    <nav className='bg-card border-b border-border sticky top-0 z-50'>
      <div className='max-w-5xl mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href='/' className='text-xl font-bold text-primary'>
          TOEIC <span className='font-light text-muted-foreground'>Practice</span>
        </Link>
      </div>
    </nav>
  )
}
