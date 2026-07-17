'use client'

import { motion } from 'framer-motion'
import { containerVariants } from '@/features/landing/animations'
import { HeroContent } from '@/features/landing/components/ToeicLanding/HeroSection/HeroContent'
import { HeroImagePanel } from '@/features/landing/components/ToeicLanding/HeroSection/HeroImagePanel'
import { ResponsiveSection } from '@/features/landing/components/ToeicLanding/HeroSection/ResponsiveSection'

export function HeroSection() {
  return (
    <section className='relative overflow-hidden bg-linear-to-b from-green-teal-10 via-green-bright to-green-bright py-4 md:pb-20 md:pt-20 lg:pb-24'>
      <div className='relative z-10 mx-auto max-w-7xl px-2 sm:px-6 md:px-8 lg:hidden'>
        <ResponsiveSection />
      </div>
      <motion.div
        className='relative z-10 mx-auto hidden max-w-7xl items-center gap-10 px-4 py-4 sm:px-6 md:gap-14 md:px-8 lg:grid lg:grid-cols-2 lg:gap-15 lg:px-12'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <HeroContent />
        <HeroImagePanel />
      </motion.div>
    </section>
  )
}
