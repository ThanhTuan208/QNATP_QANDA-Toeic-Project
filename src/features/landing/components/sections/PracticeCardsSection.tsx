'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/common/Button/button'

const RESOURCE_CARDS = [
  {
    title: 'Ngữ pháp',
    badge: 'Part 5',
    badgeColor: 'bg-primary/10 text-primary',
    description:
      'Chinh phục Part 5 TOEIC với hệ thống bài học, ví dụ minh họa và hàng trăm câu luyện tập theo từng chủ điểm.',
    gradient: 'from-primary to-green-dark',
    icon: 'BookOpen',
    buttonLabel: 'Bắt đầu',
    buttonClass: 'bg-primary text-primary-foreground',
  },
  {
    title: 'Từ vựng',
    badge: '600+ Từ thiết yếu',
    badgeColor: 'bg-secondary/10 text-secondary-foreground',
    description:
      'Học từ vựng qua flashcard thông minh, phát âm chuẩn và các ngữ cảnh thực tế thường gặp nhất trong bài thi TOEIC.',
    gradient: 'from-green-dark to-safety-orange',
    icon: 'Languages',
    buttonLabel: 'Học ngay',
    buttonClass: 'bg-secondary text-secondary-foreground',
  },
  {
    title: 'Luyện đề',
    badge: 'Full Test',
    badgeColor: 'bg-error/10 text-error',
    description:
      'Trải nghiệm áp lực phòng thi thật với kho đề ETS mới nhất, có bấm giờ và chấm điểm, giải thích chi tiết từng câu.',
    gradient: 'from-error to-primary',
    icon: 'ClipboardList',
    buttonLabel: 'Thi thử',
    buttonClass: 'bg-error text-primary-foreground',
  },
  {
    title: 'Bài giảng Video',
    badge: 'Mẹo & Chiến thuật',
    badgeColor: 'bg-warning/10 text-warning-foreground',
    description:
      'Tổng hợp các video bài giảng chất lượng cao, chia sẻ mẹo tránh bẫy và phương pháp làm bài nhanh từ các chuyên gia.',
    gradient: 'from-safety-orange to-primary',
    icon: 'Video',
    buttonLabel: 'Xem ngay',
    buttonClass: 'bg-primary text-primary-foreground',
  },
]

function CardIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    BookOpen: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='48'
        height='48'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20' />
      </svg>
    ),
    Languages: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='48'
        height='48'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='m5 8 6 6' />
        <path d='m4 14 6-6 2-3' />
        <path d='M2 5h12' />
        <path d='M7 2h1' />
        <path d='m22 22-5-10-5 10' />
        <path d='M14 18h6' />
      </svg>
    ),
    ClipboardList: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='48'
        height='48'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect x='8' y='2' width='8' height='4' rx='1' />
        <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
        <path d='M12 11h4' />
        <path d='M12 16h4' />
        <path d='M8 11h.01' />
        <path d='M8 16h.01' />
      </svg>
    ),
    Video: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='48'
        height='48'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect x='2' y='4' width='20' height='16' rx='2' />
        <path d='m10 9 5 3-5 3Z' />
      </svg>
    ),
  }

  return <>{icons[name] ?? null}</>
}

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
    <div className='mb-20'>
      <div className='flex items-center justify-between mb-8'>
        <h3 className='text-2xl font-semibold text-foreground'>Tài nguyên học tập</h3>
        <div className='flex gap-2'>
          <button
            onClick={() => scrollContainer('left')}
            className='w-10 h-10 rounded-full border border-border flex items-center justify-center text-primary hover:bg-primary/5 transition-colors'
          >
            <ChevronLeft className='h-5 w-5' />
          </button>
          <button
            onClick={() => scrollContainer('right')}
            className='w-10 h-10 rounded-full border border-border flex items-center justify-center text-primary hover:bg-primary/5 transition-colors'
          >
            <ChevronRight className='h-5 w-5' />
          </button>
        </div>
      </div>

      <div
        id='resource-cards-scroll'
        className='flex pt-8 gap-6 overflow-x-auto pb-8 scroll-smooth'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {RESOURCE_CARDS.map((card) => (
          <div
            key={card.title}
            className='relative flex min-w-[350px] flex-col rounded-2xl bg-card text-card-foreground shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
          >
            <div
              className={`relative mx-5 -mt-5 flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r ${card.gradient} text-white shadow-lg`}
            >
              <CardIcon name={card.icon} />
            </div>

            <div className='flex flex-1 flex-col p-6'>
              <div className='flex items-center justify-between'>
                <h4 className='text-xl font-semibold'>{card.title}</h4>
                <span className={`rounded-full ${card.badgeColor} px-3 py-1 text-xs font-semibold`}>
                  {card.badge}
                </span>
              </div>
              <p className='mt-4 flex-1 text-sm text-muted-foreground leading-relaxed'>
                {card.description}
              </p>
            </div>

            <div className='px-6 pb-6'>
              <Button className={`w-full rounded-xl ${card.buttonClass} py-3 hover:opacity-90`}>
                {card.buttonLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
