'use client'

import { cn } from '@/lib/utils'
import styles from './AnimatedLoader.module.scss'

interface AnimatedLoaderProps {
  fullScreen?: boolean
}

export function AnimatedLoader({ fullScreen = true }: AnimatedLoaderProps) {
  return (
    <div className={cn(styles.wrapper, fullScreen && styles.fullScreen)}>
      <div className={styles.circ}>
        <div className={styles.load}>Loading . . .</div>
        <div className={styles.hands} />
        <div className={styles.body} />
        <div className={styles.head}>
          <div className={styles.eye} />
        </div>
      </div>
    </div>
  )
}
