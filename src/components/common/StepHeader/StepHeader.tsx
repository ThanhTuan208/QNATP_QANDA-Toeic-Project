'use client'

import type { ReactNode } from 'react'

interface StepHeaderProps {
  title: string
  description: string
  icon?: ReactNode
}

export function StepHeader({ title, description, icon }: StepHeaderProps) {
  return (
    <div className='text-center space-y-2'>
      {icon && (
        <div className='inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-teal-5 text-green-teal mb-2'>
          {icon}
        </div>
      )}
      <h2 className='text-2xl font-bold tracking-tight text-foreground'>{title}</h2>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  )
}
