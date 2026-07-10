import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAccuracy(correct: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((correct / total) * 100)}%`
}
