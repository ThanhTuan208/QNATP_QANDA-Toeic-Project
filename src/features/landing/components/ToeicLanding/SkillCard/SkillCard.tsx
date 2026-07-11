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
        <div className='group skill-card-hover bg-card p-7 rounded-2xl border border-border soft-depth cursor-pointer'>
          <div className='flex justify-between items-start mb-8'>
            <div className='w-11 h-11 rounded-xl bg-green-bright flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300'>
              <Icon className='h-5 w-5' />
            </div>
            <span className='px-2.5 py-1 rounded-lg bg-green-teal-10 text-muted-foreground text-xs font-medium'>
              {skill.part}
            </span>
          </div>
          {skill.description && (
            <p className='text-sm text-muted-foreground'>{skill.description}</p>
          )}
          <h4 className='text-xl font-semibold mb-6'>{skill.title}</h4>
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
        <div className='group flex items-center justify-between p-5 bg-card rounded-2xl border border-border skill-card-hover cursor-pointer'>
          <div className='flex items-center gap-5'>
            <div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all'>
              <Icon className='h-5 w-5' />
            </div>
            <div>
              <p className='text-xs font-medium text-primary mb-0.5'>{skill.part}</p>
              <h4 className='text-sm font-semibold'>{skill.title}</h4>
            </div>
          </div>
          {skill.badge && (
            <Button className='px-5 py-2 rounded-xl bg-primary/5 text-primary text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all'>
              {skill.badge}
            </Button>
          )}
        </div>
      )

    case 'featured':
      return (
        <div className='group relative bg-card p-10 rounded-3xl border border-border soft-depth overflow-hidden skill-card-hover cursor-pointer'>
          <div className='absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-[100px] transition-transform group-hover:scale-110' />
          <div className='relative z-10'>
            <div className='flex items-center gap-5 mb-8'>
              <div className='w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-primary'>
                <Icon className='h-7 w-7' />
              </div>
              <div>
                <p className='text-xs font-medium text-primary uppercase tracking-wider mb-0.5'>
                  {skill.part}
                </p>
                <h4 className='text-2xl font-semibold'>{skill.title}</h4>
              </div>
            </div>
            {skill.description && (
              <p className='text-base text-muted-foreground mb-10 max-w-sm leading-relaxed opacity-90'>
                {skill.description}
              </p>
            )}
            <div className='flex items-center gap-6'>
              {skill.buttonLabel && (
                <Button className='px-8 py-3.5 rounded-2xl bg-safety-orange text-white hover:shadow-lg hover:shadow-safety-orange/30'>
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
        <div className='group bg-primary p-7 rounded-2xl soft-depth cursor-pointer relative overflow-hidden text-primary-foreground skill-card-hover'>
          <div className='relative z-10'>
            <p className='text-xs font-medium opacity-80 mb-0.5'>{skill.part}</p>
            <h4 className='text-xl font-semibold mb-6'>{skill.title}</h4>
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
