'use client'

import type * as React from 'react'

import { cn } from '@/lib/utils'

const Label = ({ className, ...props }: React.ComponentProps<'label'>) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: generic DS component, htmlFor passed via ...props
  <label
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className,
    )}
    {...props}
  />
)

export { Label }
