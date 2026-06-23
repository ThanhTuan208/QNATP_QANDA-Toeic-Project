import Link from 'next/link'
import { PRACTICE_TYPES } from '@/constants/index.constant'

export function PracticeCardsSection() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      {PRACTICE_TYPES.map((type) => (
        <Link
          key={type.id}
          href={`/practice/${type.id}`}
          className='group block p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary hover:-translate-y-0.5 transition-all'
        >
          <div className='text-3xl mb-3'>{type.icon}</div>
          <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
            {type.label}
          </h3>
          <p className='text-sm text-muted-foreground mt-1 leading-relaxed'>{type.description}</p>
        </Link>
      ))}
    </div>
  )
}
