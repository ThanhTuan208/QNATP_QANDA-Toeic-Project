'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { faqs } from '@/features/landing/constants'
import { cn } from '@/lib/utils'

export function FAQSection() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const toggle = (value: string) => {
    setOpenItem((prev) => (prev === value ? null : value))
  }

  return (
    <section className='py-10 md:py-12 lg:py-16'>
      <div className='mx-auto max-w-3xl px-4 md:px-6'>
        <div className='mb-10 md:mb-12 text-center'>
          <h2 className='mb-3 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl lg:text-4xl'>
            Câu hỏi thường gặp
          </h2>
          <p className='text-sm text-muted-foreground md:text-base lg:text-lg'>
            Mọi thắc mắc của bạn đều được giải đáp tại đây.
          </p>
        </div>

        <div className='divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm'>
          {faqs.map((faq) => {
            const isOpen = openItem === faq.value

            return (
              <div key={faq.value}>
                <button
                  type='button'
                  onClick={() => toggle(faq.value)}
                  className={cn(
                    'flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-foreground transition-colors md:px-6 md:text-base',
                    isOpen && 'text-primary',
                  )}
                >
                  <span className='flex-1 pr-4'>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300',
                      isOpen && 'rotate-180 text-primary',
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key='content'
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className='overflow-hidden'
                    >
                      <div className='px-5 pb-4 text-sm leading-relaxed text-muted-foreground md:px-6 md:text-base'>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
