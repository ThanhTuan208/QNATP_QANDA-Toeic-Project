import type { LucideIcon } from 'lucide-react'

export interface NavDropdownItem {
  label: string
  description?: string
  href: string
  icon: LucideIcon
}

export interface NavItem {
  label: string
  href?: string
  dropdownItems?: NavDropdownItem[]
}
