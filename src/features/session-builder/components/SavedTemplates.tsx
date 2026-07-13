'use client'

import { Folder } from 'lucide-react'

export function SavedTemplates() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4'>
      <div className='size-16 rounded-2xl bg-muted flex items-center justify-center'>
        <Folder className='size-8 text-muted-foreground' />
      </div>
      <h2 className='text-xl font-bold text-foreground'>Saved Templates</h2>
      <p className='text-muted-foreground max-w-md'>
        Tính năng đang phát triển. Cấu hình bài luyện tập yêu thích của bạn sẽ được lưu tại đây.
      </p>
    </div>
  )
}
