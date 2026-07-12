'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Pointer, Zap } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { fadeSlideUp } from '@/features/landing/animations'

export function HeroContent() {
  return (
    <div className='flex flex-col gap-5'>
      <motion.div
        className='inline-flex w-fit items-center gap-2 rounded-lg bg-green-teal-10 px-4 py-1.5 text-xs font-bold text-accent-foreground'
        variants={fadeSlideUp}
      >
        <Zap className='h-4 w-4 text-safety-orange' />
        YOUR ONLY LIMIT IS YOUR MIND
      </motion.div>

      <motion.h1
        className='text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-4xl'
        variants={fadeSlideUp}
      >
        Chinh phục TOEIC bằng
        <span className='text-primary'> Quyết tâm của bạn</span> & Công nghệ dẫn đường.
      </motion.h1>

      <motion.blockquote
        className='max-w-xl border-l-4 border-primary pl-4 text-base italic leading-7 text-muted-foreground md:pl-6 md:text-lg md:leading-8'
        variants={fadeSlideUp}
      >
        &quot;Không có đường tắt đến thành công, chỉ có sự kiên trì mỗi ngày.&quot;
        <span className='mt-3 block text-base not-italic text-foreground'>
          Chúng tôi sẽ đồng hành cùng quyết tâm bứt phá điểm số của bạn trên hành trình này.
        </span>
      </motion.blockquote>

      <motion.div className='flex flex-row flex-wrap items-center justify-start ml-2 gap-6 pt-10 sm:gap-8'>
        <Button
          icon={<ArrowRight className='h-5 w-5' />}
          iconPosition='right'
          className='h-11 w-fit rounded-xl bg-linear-to-r from-peach-cream/95 to-safety-orange px-5 text-sm font-semibold text-neutral-90/80 shadow-lg shadow-safety-orange/20 transition-all duration-300 hover:text-neutral-0 hover:-translate-y-1 hover:bg-safety-orange/90 hover:shadow-xl hover:shadow-safety-orange/40 active:translate-y-0 sm:h-14 sm:px-8 sm:text-base'
        >
          Tiến cung
        </Button>
        <div className='relative group inline-block w-fit'>
          <div className='absolute -inset-1 rounded-xl bg-linear-to-r from-primary to-cyan-500 opacity-30 blur-md transition duration-500 group-hover:opacity-70 group-hover:duration-200' />

          <div className='absolute inset-0 pointer-events-none z-0 rounded-xl'>
            {[...Array(2)].map((_, index) => (
              <motion.div
                key={index.toString()}
                className='absolute inset-0 rounded-xl border-2 border-primary/40'
                animate={{
                  scale: [1, 1.25, 1.3],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 1,
                }}
              />
            ))}
          </div>

          <div className='relative inline-block'>
            <motion.div
              className='pointer-events-none absolute -right-2 top-12 z-20'
              animate={{
                y: [0, 5, 0], // Di chuyển lên nhẹ và quay về
                opacity: [1, 0.7, 1], // Mờ đi nhẹ rồi hiện lại
              }}
              transition={{
                duration: 0.8, // Thời gian một chu kỳ gõ
                repeat: Infinity, // Lặp vô tận
                ease: 'linear', // Tốc độ tuyến tính
              }}
            >
              <Pointer
                className='text-right h-5 w-5 -shadow-md'
                style={{ transform: 'rotate(320deg)' }}
              />
            </motion.div>

            <Button
              buttonType='outline'
              className='relative z-10 h-11 w-fit rounded-xl border-2 bg-background px-5 text-sm text-neutral-90/80 font-semibold shadow-xs transition-all duration-300 hover:border-primary hover:text-subtext-100 sm:h-14 sm:px-8 sm:text-base'
            >
              Thử trình
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
