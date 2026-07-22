'use client'

import { X } from 'lucide-react'
import type { PracticeContext } from '@/types/sidebar'
import SidebarActions from './SidebarActions'
import SidebarBrand from './SidebarBrand'
import SidebarNavigation from './SidebarNavigation'
import SidebarOverlay from './SidebarOverlay'

interface SidebarProps {
  isOpen: boolean
  isCollapsed?: boolean
  isLoggedIn?: boolean
  isHidden?: boolean
  onClose: () => void
  onToggle?: () => void
  onToggleCollapse?: () => void
  onSettingsClick?: () => void
  onLogout?: () => void
  currentPracticeContext?: PracticeContext | null
  onTopicClick?: (topicSlug: string) => void
  onSectionClick?: (topicSlug: string, sectionId: string) => void
}

export default function Sidebar({
  isOpen,
  isCollapsed = false,
  isHidden = false,
  isLoggedIn = true,
  onClose,
  onToggle,
  onToggleCollapse,
  onSettingsClick,
  onLogout,
  currentPracticeContext,
  onTopicClick,
  onSectionClick,
}: SidebarProps) {
  const isExpanded = isOpen || !isCollapsed

  return (
    <>
      <SidebarOverlay isOpen={isOpen} onClose={onClose} />

      {!isOpen && !isHidden && onToggle && (
        <button
          type='button'
          onClick={onToggle}
          className='fixed bottom-6 left-4 z-30 flex lg:hidden items-center justify-center size-12 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200'
          aria-label='Open sidebar'
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            role='img'
            aria-hidden='true'
          >
            <line x1='3' y1='6' x2='21' y2='6' />
            <line x1='3' y1='12' x2='21' y2='12' />
            <line x1='3' y1='18' x2='21' y2='18' />
          </svg>
        </button>
      )}

      <aside
        className={`h-screen border-r border-sidebar-border fixed left-0 top-0 flex flex-col z-60 lg:z-40 transition-all duration-400 ease-in-out w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isHidden ? 'lg:-translate-x-full' : 'lg:translate-x-0'}
          ${isCollapsed && !isHidden ? 'lg:w-20' : ''}
          bg-white/75 backdrop-blur-xl text-sidebar-foreground shadow-[2px_0_24px_-8px_color-mix(in_srgb,var(--color-neutral-100)_12%,transparent)]
          before:absolute before:inset-0 before:pointer-events-none before:bg-linear-to-b before:from-green-teal-5/30 before:to-transparent`}
      >
        <div className='relative z-10 flex flex-col h-full px-3 py-4'>
          {/* Header offset for desktop */}
          <div className='h-18 shrink-0 hidden lg:block' />
          {/* Close button on mobile/tablet */}
          <div className='flex items-center justify-end h-12 shrink-0 lg:hidden'>
            <button
              type='button'
              onClick={onClose}
              className='flex items-center justify-center size-8 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-accent/60 transition-all duration-200 active:scale-90'
              aria-label='Close sidebar'
            >
              <X size={18} />
            </button>
          </div>

          <SidebarBrand
            isExpanded={isExpanded}
            isHidden={isHidden}
            currentPracticeContext={currentPracticeContext ?? null}
            onToggleCollapse={onToggleCollapse}
            onClose={onClose}
          />

          <div className='flex-1 overflow-hidden'>
            <SidebarNavigation
              isExpanded={isExpanded}
              currentPracticeContext={currentPracticeContext ?? null}
              onTopicClick={onTopicClick ?? (() => {})}
              onSectionClick={onSectionClick ?? (() => {})}
            />
          </div>

          <SidebarActions
            isExpanded={isExpanded}
            isLoggedIn={isLoggedIn}
            onSettingsClick={onSettingsClick}
            onLogout={onLogout}
          />
        </div>
      </aside>
    </>
  )
}
