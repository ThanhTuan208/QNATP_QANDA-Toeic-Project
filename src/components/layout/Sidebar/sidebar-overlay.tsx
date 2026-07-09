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
          onClick={onClose}
          className='fixed inset-0 bg-black/50 z-60 lg:hidden backdrop-blur-sm'
        />
      )}
    </AnimatePresence>
  )
}
