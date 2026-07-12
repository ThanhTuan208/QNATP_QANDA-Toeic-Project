'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { CardIcon } from '@/features/landing/components/ToeicLanding/PracticeCardsSection/CardIcon'
import { resourceCard } from '@/features/landing/constants'

export function PracticeCardsSection() {
  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('resource-cards-scroll')
    if (!container) return
    const scrollAmount = 400
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className='mb-16 md:mb-20'>
      <div className='flex items-center justify-between mb-6 md:mb-8'>
        <h3 className='text-xl font-semibold text-foreground md:text-2xl'>Tài nguyên học tập</h3>
        <div className='hidden gap-2 sm:flex'>
          <Button
            buttonType='none'
            onClick={() => scrollContainer('left')}
            className='w-10 h-10 rounded-full border border-border flex items-center justify-center text-primary hover:bg-primary/5 transition-colors'
          >
            <ChevronLeft className='h-5 w-5' />
          </Button>
          <Button
            buttonType='none'
            onClick={() => scrollContainer('right')}
            className='w-10 h-10 rounded-full border border-border flex items-center justify-center text-primary hover:bg-primary/5 transition-colors'
          >
            <ChevronRight className='h-5 w-5' />
          </Button>
        </div>
      </div>

      <div
        id='resource-cards-scroll'
        className='flex gap-6 overflow-x-auto pb-8 scroll-smooth lg:gap-10 md:pt-8'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {resourceCard.map((card) => (
          <div
            key={card.title}
            className='relative flex min-w-55 flex-col rounded-2xl bg-card text-card-foreground shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl mt-5 lg:mt-0 sm:min-w-65 md:min-w-75 lg:min-w-87.5'
          >
            <div
              className={`relative mx-4 -mt-4 flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-r ${card.gradient} text-white shadow-lg md:mx-5 md:-mt-5 md:h-36`}
            >
              <CardIcon name={card.icon} />
            </div>

            <div className='flex flex-1 flex-col p-4 md:p-6'>
              <div className='flex items-center justify-between'>
                <h4 className='text-lg font-semibold md:text-xl'>{card.title}</h4>
                <span
                  className={`rounded-full ${card.badgeColor} px-2 py-0.5 text-[11px] font-semibold md:px-3 md:py-1 md:text-xs`}
                >
                  {card.badge}
                </span>
              </div>
              <p className='mt-3 text-sm text-muted-foreground leading-relaxed md:mt-4 line-clamp-3 md:line-clamp-none md:flex-1'>
                {card.description}
              </p>
            </div>

            <div className='px-4 pb-4 md:px-6 md:pb-6'>
              <Button className={`w-full rounded-2xl-md font-bold ${card.buttonClass} py-3 hover:opacity-90`}>
                {card.buttonLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
