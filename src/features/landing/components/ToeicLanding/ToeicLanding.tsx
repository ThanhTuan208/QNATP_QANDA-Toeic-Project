'use client'

import { skillGroups } from '@/features/landing/constants'
import { CTAWithSubscription } from './CTAWithSubscription'
import { FAQSection } from './FAQSection'
import { HeroSection } from './HeroSection'
import { LandingFooter } from './LandingFooterSection'
import { PracticeCardsSection } from './PracticeCardsSection'
import { SkillGroup } from './SkillGroupSection'

export default function TOEICLanding() {
  return (
    <main className='bg-background text-foreground'>
      <HeroSection />

      <section className='py-10 md:py-20 bg-card'>
        <div className='max-w-7xl mx-auto px-4 lg:px-12'>
          <div className='text-center mb-10 md:mb-16 lg:mb-20'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary mb-4 md:mb-6 text-[11px] font-bold tracking-wide'>
              LỘ TRÌNH CHUẨN HÓA
            </div>
            <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4'>
              Luyện tập theo từng kỹ năng
            </h2>
            <p className='text-xs sm:text-sm md:text-base text-muted-foreground max-w-3xl mx-auto opacity-80'>
              Hệ thống câu hỏi sát thực tế, được phân loại chi tiết giúp bạn tập trung vào những
              phần còn yếu.
            </p>
          </div>

          <PracticeCardsSection />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16'>
            {skillGroups.map((group) => (
              <SkillGroup key={group.id} group={group} />
            ))}
          </div>
        </div>
      </section>

      <FAQSection />
      <CTAWithSubscription />
      <LandingFooter />
    </main>
  )
}
