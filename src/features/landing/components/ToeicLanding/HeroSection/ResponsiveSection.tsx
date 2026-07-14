'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { HeroContent } from '@/features/landing/components/ToeicLanding/HeroSection/HeroContent'
import { HeroImagePanel } from '@/features/landing/components/ToeicLanding/HeroSection/HeroImagePanel'
import { cn } from '@/lib/utils'

export function ResponsiveSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef(false)

  useEffect(() => {
    if (isDragging) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === 0 ? 1 : 0))
    }, 5000)
    return () => clearInterval(timer)
  }, [isDragging])

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    setIsDragging(false)
    dragRef.current = false
    const swipe = info.offset.x
    if (Math.abs(swipe) > 50) {
      if (swipe < 0 && activeIndex < 1) setActiveIndex(activeIndex + 1)
      else if (swipe > 0 && activeIndex > 0) setActiveIndex(activeIndex - 1)
    }
  }
  return (
    <>
      <div className='relative overflow-hidden'>
        <motion.div
          className='flex'
          animate={{ x: `${-activeIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragStart={() => {
            setIsDragging(true)
            dragRef.current = true
          }}
          onDragEnd={handleDragEnd}
        >
          <div className='flex w-full shrink-0 items-center'>
            <div className='w-full'>
              <HeroContent />
            </div>
          </div>
          <div className='w-full shrink-0'>
            <HeroImagePanel />
          </div>
        </motion.div>
      </div>

      <div className='mt-6 flex items-center justify-center gap-2'>
        {[0, 1].map((i) => (
          <button
            type='button'
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === activeIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50',
            )}
          />
        ))}
      </div>
    </>
  )
}
