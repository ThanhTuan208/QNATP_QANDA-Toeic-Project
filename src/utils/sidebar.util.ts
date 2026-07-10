import { TYPE_LABEL_MAP_VIETNAM } from '@/constants/index.constant'

export function FirstCharOfStringCapitalize(text?: string) {
  if (!text) return
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function ConvertSlugToNameVietNam(slug?: string) {
  if (!slug) return
  return TYPE_LABEL_MAP_VIETNAM[slug]
}
