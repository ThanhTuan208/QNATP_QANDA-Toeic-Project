'use client'

import { AnimatePresence, motion } from 'framer-motion'

interface SidebarOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function SidebarOverlay({ isOpen, onClose }: SidebarOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          onClick={onClose}
          className='fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm'
        />
      )}
    </AnimatePresence>
  )
}
