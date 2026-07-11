'use client'

import { motion } from 'framer-motion'
import { ArrowRight, PlayCircle, Zap } from 'lucide-react'
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
        className='text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl'
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

      <motion.div className='flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:gap-4' variants={fadeSlideUp}>
        <Button
          icon={<ArrowRight className='h-5 w-5' />}
          iconPosition='right'
          className='h-12 w-full rounded-xl bg-linear-to-r from-safety-orange to-orange-500 px-6 text-sm font-semibold text-white shadow-lg shadow-safety-orange/20 transition-all duration-300 hover:-translate-y-1 hover:bg-safety-orange/90 hover:shadow-xl hover:shadow-safety-orange/40 active:translate-y-0 sm:h-14 sm:w-auto sm:px-8 sm:text-base'
        >
          Khởi đầu quyết tâm
        </Button>

        <Button
          buttonType='outline'
          icon={<PlayCircle className='h-5 w-5' />}
          className='h-12 w-full rounded-xl border-2 px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary/5 hover:shadow-md sm:h-14 sm:w-auto sm:px-8 sm:text-base'
        >
          Thử thách năng lực
        </Button>
      </motion.div>
    </div>
  )
}
