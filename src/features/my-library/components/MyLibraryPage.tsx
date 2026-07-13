'use client'

import { BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function MyLibraryPage() {
  const router = useRouter()

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4'>
      <div className='size-16 rounded-2xl bg-muted flex items-center justify-center'>
        <BookOpen className='size-8 text-muted-foreground' />
      </div>
      <h2 className='text-xl font-bold text-foreground'>My Library</h2>
      <p className='text-muted-foreground max-w-md'>
        Tính năng đang phát triển. Bạn có thể lưu câu hỏi từ các bài luyện tập để xem lại sau.
      </p>
      <button
        type='button'
        onClick={() => router.push('/practice/mixed-practice/create-session')}
        className='bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all'
      >
        Quay lại Create Session
      </button>
    </div>
  )
}
