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
    <div className={`grid gap-3 md:gap-4 w-full ${totalItems === 1
        ? 'grid-cols-1'
        : 'grid-cols-2 lg:grid-cols-3'
      }`}>
      {PRESETS.map((p) => {
        const Icon = p.icon
        const isSelected = selected === p.id

        return (
          <button
            key={p.id}
            type='button'
            onClick={() => onSelect(p.id)}
            className={`group text-left p-3.5 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 select-none cursor-pointer flex flex-col justify-between min-h-[120px] md:min-h-[140px] relative overflow-hidden active:scale-[0.98] ${isSelected
                ? 'border-green-teal bg-green-bright/15 dark:bg-green-teal-20/10 shadow-md md:shadow-lg shadow-green-teal-10/5 dark:shadow-black/20 -translate-y-0.5'
                : 'border-green-teal-10/40 dark:border-neutral-80/10 bg-card/50 dark:bg-card/20 hover:border-green-teal-25 hover:bg-green-bright/10 dark:hover:bg-neutral-90/20 hover:-translate-y-0.5 hover:shadow-sm'
              }`}
          >
            {/* Hiệu ứng Glow nền khi hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-teal-10/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 w-full space-y-1.5 md:space-y-2">
              {/* Header: Icon + Tên Preset */}
              <div className='flex items-center gap-2.5'>
                <div
                  className={`p-1.5 md:p-2 rounded-lg md:rounded-xl transition-all duration-300 shrink-0 ${isSelected
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-green-teal-10/20'
                      : 'bg-green-teal-10/25 dark:bg-neutral-80/10 text-green-teal dark:text-pale-teal group-hover:scale-105 group-hover:rotate-3'
                    }`}
                >
                  <Icon className='h-3.5 w-3.5 md:h-4.5 md:w-4.5 transition-transform duration-300' />
                </div>

                <span
                  className={`text-xs md:text-sm font-bold truncate transition-colors duration-300 ${isSelected
                      ? 'text-primary-teal dark:text-pale-light'
                      : 'text-foreground group-hover:text-primary-teal dark:group-hover:text-pale-teal'
                    }`}
                >
                  {p.label}
                </span>
              </div>

              {/* Mô tả chi tiết - Tự động ẩn bớt dòng trên mobile siêu nhỏ */}
              <p className='text-[11px] md:text-xs text-subtext-90 dark:text-neutral-30 opacity-75 leading-relaxed line-clamp-1 xs:line-clamp-2 pr-1'>
                {p.description}
              </p>
            </div>

            {/* Footer: Subtext & Radio Indicator */}
            <div className='relative z-10 w-full flex items-center justify-between mt-2.5 pt-2 border-t border-green-teal-10/15 dark:border-neutral-80/10'>
              <span
                className={`text-[8px] md:text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg transition-all duration-300 border ${isSelected
                    ? 'bg-green-teal-10/60 dark:bg-green-teal-20/20 text-green-teal dark:text-pale-teal border-green-teal-25'
                    : 'bg-neutral-5 dark:bg-neutral-90/20 text-subtext-50 dark:text-neutral-45 border-transparent group-hover:border-green-teal-10/30 group-hover:text-green-teal dark:group-hover:text-pale-teal'
                  }`}
              >
                {p.subtext}
              </span>

              {/* Radio Indicator (Nhỏ gọn hơn trên mobile) */}
              <div
                className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${isSelected
                    ? 'border-green-teal bg-transparent'
                    : 'border-green-teal-10/60 dark:border-neutral-80/20 bg-transparent group-hover:border-green-teal-20'
                  }`}
              >
                <div
                  className={`w-1.5 h-1.5 md:w-1.8 md:h-1.8 rounded-full bg-green-teal transition-all duration-300 ${isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
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