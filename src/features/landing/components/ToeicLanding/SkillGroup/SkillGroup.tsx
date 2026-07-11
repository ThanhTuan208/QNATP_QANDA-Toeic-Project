import type { SkillGroupData } from '@/features/landing/types'
import { SkillCard } from '../SkillCard'

interface SkillGroupProps {
  group: SkillGroupData
}

export function SkillGroup({ group }: SkillGroupProps) {
  const Icon = group.icon

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex items-center justify-between border-b border-border pb-6'>
        <div className='flex items-center gap-4'>
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-xl ${group.iconBgClass} ${group.iconColorClass}`}
          >
            <Icon className='h-5 w-5' />
          </div>
          <h3 className='text-2xl font-semibold'>{group.title}</h3>
        </div>
        <span className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>
          {group.partsRange}
        </span>
      </div>

      {group.id === 'listening' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {group.skills.slice(0, 2).map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
          <div className='sm:col-span-2 space-y-4'>
            {group.skills.slice(2).map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-6'>
          <SkillCard skill={group.skills[0]} />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {group.skills.slice(1).map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
