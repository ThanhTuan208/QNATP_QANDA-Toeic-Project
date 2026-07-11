'use client'

import { skillGroups } from '@/features/landing/constants'
import { PracticeCardsSection } from './PracticeCardsSection'
import { CTAWithSubscription } from './CTAWithSubscription'
import { HeroSection } from './HeroSection'
import { LandingFooter } from './LandingFooterSection'
import { SkillGroup } from './SkillGroupSection'

export default function TOEICLanding() {
  return (
    <main className='bg-background text-foreground'>
      <HeroSection />

      <section className='py-10 md:py-20 bg-card'>
        <div className='max-w-7xl mx-auto px-4 lg:px-12'>
          <div className='text-center mb-20'>
            <div className='inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/5 text-primary mb-6 text-xs font-bold tracking-wide'>
              LỘ TRÌNH CHUẨN HÓA
            </div>
            <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-4'>
              Luyện tập theo từng kỹ năng
            </h2>
            <p className='text-base text-muted-foreground max-w-3xl mx-auto opacity-80'>
              Hệ thống câu hỏi sát thực tế, được phân loại chi tiết giúp bạn tập trung vào những
              phần còn yếu.
            </p>
          </div>

          <PracticeCardsSection />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
            {skillGroups.map((group) => (
              <SkillGroup key={group.id} group={group} />
            ))}
          </div>
        </div>
      </section>

      <CTAWithSubscription />
      <LandingFooter />
    </main>
  )
}
