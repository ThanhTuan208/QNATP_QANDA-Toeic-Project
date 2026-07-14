'use client'

import { motion } from 'framer-motion'
import type { ComponentProps, ReactNode } from 'react'

type MotionDivProps = ComponentProps<typeof motion.div>

export const stepTransition: MotionDivProps = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.2 },
}

interface AnimatedStepProps {
  children: ReactNode
  className?: string
  key?: string
}

export function AnimatedStep({ key, children, className }: AnimatedStepProps) {
  return (
    <motion.div key={key} {...stepTransition} className={className}>
      {children}
    </motion.div>
  )
}
