import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/common/Button'
import type { SkillCardData } from '@/features/landing/types'

interface SkillCardProps {
  skill: SkillCardData
}

export function SkillCard({ skill }: SkillCardProps) {
  const Icon = skill.icon

  switch (skill.variant) {
    case 'grid':
      return (
        <div className='group skill-card-hover bg-card p-4 md:p-5 rounded-2xl border border-border soft-depth cursor-pointer'>
          <div className='flex justify-between items-start mb-3 md:mb-̀6'>
            <div className='w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-green-bright flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300'>
              <Icon className='h-4 w-4 sm:h-5 sm:w-5' />
            </div>
            <span className='px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-green-teal-10 text-muted-foreground text-xs font-medium'>
              {skill.part}
            </span>
          </div>
          <h4 className='text-ms md:text-md font-semibold mb-1'>
            {skill.title}
          </h4>

          {skill.description && (
            <p className='text-xs text-muted-foreground line-clamp-2 sm:line-clamp-none mb-2 md:mb-4'>
              {skill.description}
            </p>
          )}
          <div className='flex justify-between items-center'>
            {skill.label && (
              <span className='px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium'>
                {skill.label}
              </span>
            )}
            <ArrowRight className='h-5 w-5 text-primary group-hover:translate-x-1 transition-transform' />
          </div>
        </div>
      )

    case 'horizontal':
      return (
        <div className='group flex items-center justify-between p-4 md:p-5 bg-card rounded-2xl border border-border skill-card-hover cursor-pointer'>
          <div className='flex items-center gap-3 md:gap-5'>
            <div className='w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all'>
              <Icon className='h-5 w-5' />
            </div>
            <div>
              <p className='text-xs font-medium text-primary mb-0.5'>{skill.part}</p>
              <h4 className='text-sm font-semibold'>{skill.title}</h4>
              {skill.description && (
                <p className='text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-50 md:max-w-xs'>{skill.description}</p>
              )}
            </div>
          </div>
          {skill.badge && (
            <Button className='px-3 py-1.5 md:px-5 md:py-2 rounded-xl bg-primary/5 text-primary text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all'>
              {skill.badge}
            </Button>
          )}
        </div>
      )

    case 'featured':
      return (
        <div className='group relative bg-card p-6 rounded-2xl md:rounded-3xl border border-border soft-depth overflow-hidden skill-card-hover cursor-pointer'>
          <div className='absolute top-0 right-0 w-32 h-32 md:w-38 md:h-38 bg-primary/5 rounded-bl-[100px] transition-transform group-hover:scale-110' />
          <div className='relative z-10'>
            <div className='flex items-center gap-3 md:gap-5 mb-4'>
              <div className='w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-primary'>
                <Icon className='h-6 w-6 md:h-7 md:w-7' />
              </div>
              <div>
                <p className='text-xs font-medium text-primary uppercase tracking-wider mb-0.5'>
                  {skill.part}
                </p>
                <h4 className='text-xl font-semibold md:text-2xl'>{skill.title}</h4>
              </div>
            </div>
            {skill.description && (
              <p className='text-sm md:text-base text-muted-foreground mb-8 max-w-sm leading-relaxed opacity-90'>
                {skill.description}
              </p>
            )}
            <div className='flex items-center gap-4 md:gap-6'>
              {skill.buttonLabel && (
                <Button className='px-5 py-2.5 md:px-8 md:py-3.5 font-bold rounded-2xl bg-safety-orange text-white hover:bg-safety-orange-80 hover:shadow-lg hover:shadow-safety-orange/70'>
                  {skill.buttonLabel}
                </Button>
              )}
              {skill.label && <span className='text-xs text-muted-foreground'>{skill.label}</span>}
            </div>
          </div>
        </div>
      )

    case 'dark':
      return (
        <div className='group bg-primary p-5 rounded-2xl soft-depth cursor-pointer relative overflow-hidden text-primary-foreground skill-card-hover'>
          <div className='relative z-10'>
            <p className='text-xs font-medium opacity-80 mb-0.5'>{skill.part}</p>
            <h4 className='text-lg font-semibold md:text-xl mb-4 md:mb-6'>{skill.title}</h4>
            <div className='flex justify-between items-center'>
              {skill.badge && (
                <span className='px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium'>
                  {skill.badge}
                </span>
              )}
              <Icon className='h-5 w-5 opacity-60' />
            </div>
          </div>
          <div className='absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl' />
        </div>
      )

    default:
      return null
  }
}
