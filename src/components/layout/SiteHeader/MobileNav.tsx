'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import type { NavItem } from '@/types/header'

interface MobileNavProps {
  isOpen: boolean
  navItems: NavItem[]
  onClose: () => void
}

export function MobileNav({ isOpen, navItems, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'backIn' }}
            role='none'
            className='fixed inset-0 top-18 bg-black/40 z-40 lg:hidden'
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className='absolute top-full left-0 right-0 z-50 lg:hidden max-h-[calc(100vh-4.5rem)] overflow-y-auto bg-white border-b border-border shadow-xl'
          >
            <div className='px-4 py-4 space-y-1'>
              {navItems.map((item) => {
                const hasChildren = !!(item.dropdownItems && item.dropdownItems.length > 0)
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, ease: 'backIn' }}
                  >
                    {item.href && !hasChildren ? (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className='block px-3 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-accent transition-colors'
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div className='px-3 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                        {item.label}
                      </div>
                    )}
                    {hasChildren && (
                      <div className='ml-2 space-y-0.5'>
                        {item.dropdownItems?.map((child) => {
                          const Icon = child.icon
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-accent transition-colors'
                            >
                              <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground'>
                                <Icon size={16} />
                              </div>
                              <div>
                                <p className='font-bold'>{child.label}</p>
                                {child.description && (
                                  <p className='text-xs text-muted-foreground'>
                                    {child.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
