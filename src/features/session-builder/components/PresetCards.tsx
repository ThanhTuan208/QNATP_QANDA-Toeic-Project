'use client'

import { PRESETS } from '@/features/session-builder/constants'
import type { PresetType } from '@/features/session-builder/types'

interface PresetCardsProps {
  selected: PresetType
  onSelect: (preset: PresetType) => void
}

export function PresetCards({ selected, onSelect }: PresetCardsProps) {
  const totalItems = PRESETS.length

  return (
    <div
      className={`grid gap-2 md:gap-4 w-full ${
        totalItems === 1 ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {PRESETS.map((p) => {
        const Icon = p.icon
        const isSelected = selected === p.id

        return (
          <button
            key={p.id}
            type='button'
            onClick={() => onSelect(p.id)}
            className={`group text-left p-3.5 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all duration-300 select-none cursor-pointer flex flex-col justify-between min-h-[130px] md:min-h-[150px] relative overflow-hidden active:scale-[0.98] ${
              isSelected
                ? 'border-green-teal bg-green-bright/20 dark:bg-green-teal-20/15 shadow-lg shadow-green-teal-10/15 dark:shadow-black/30 -translate-y-1 ring-2 ring-green-teal/20'
                : 'border-green-teal-10/60 dark:border-neutral-80/20 bg-card dark:bg-card/30 hover:border-green-teal hover:bg-green-bright/15 dark:hover:bg-neutral-90/30 hover:-translate-y-1 hover:shadow-md hover:shadow-green-teal-5/20'
            }`}
          >
            {/* Hiệu ứng Glow nền khi hover */}
            <div className='absolute inset-0 bg-linear-to-tr from-green-teal-10/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />

            <div className='relative z-10 w-full space-y-1.5 md:space-y-2'>
              {/* Header: Icon + Tên Preset */}
              <div className='flex items-center gap-2.5'>
                <div
                  className={`p-2 md:p-2.5 rounded-xl md:rounded-xl transition-all duration-300 shrink-0 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md shadow-green-teal-10/30'
                      : 'bg-green-teal-10/30 dark:bg-neutral-80/15 text-green-teal dark:text-pale-teal group-hover:scale-110 group-hover:rotate-3 group-hover:bg-green-teal-10/40'
                  }`}
                >
                  <Icon className='h-4 w-4 md:h-5 md:w-5 transition-transform duration-300' />
                </div>

                <span
                  className={`text-sm md:text-base font-extrabold truncate transition-colors duration-300 ${
                    isSelected
                      ? 'text-primary-teal dark:text-pale-light'
                      : 'text-foreground group-hover:text-primary-teal dark:group-hover:text-pale-teal'
                  }`}
                >
                  {p.label}
                </span>
              </div>

              {/* Mô tả chi tiết - Tự động ẩn bớt dòng trên mobile siêu nhỏ */}
              <p className='text-xs md:text-sm text-subtext-90 dark:text-neutral-30 leading-relaxed line-clamp-2 pr-1'>
                {p.description}
              </p>
            </div>

            {/* Footer: Subtext & Radio Indicator */}
            <div className='relative z-10 w-full flex items-center justify-between mt-2.5 pt-2 border-t border-green-teal-10/15 dark:border-neutral-80/10'>
              <span
                className={`text-[9px] md:text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 md:px-3 md:py-1 rounded-lg transition-all duration-300 border ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-neutral-5 dark:bg-neutral-90/20 text-subtext-50 dark:text-neutral-45 border-transparent group-hover:border-green-teal-20 group-hover:text-green-teal dark:group-hover:text-pale-teal'
                }`}
              >
                {p.subtext}
              </span>

              {/* Radio Indicator */}
              <div
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isSelected
                    ? 'border-green-teal'
                    : 'border-green-teal-10/60 dark:border-neutral-80/20 group-hover:border-green-teal-30'
                }`}
              >
                <div
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-teal transition-all duration-300 ${
                    isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
