function BookOpenIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      role='img'
      aria-hidden='true'
    >
      <path d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20' />
    </svg>
  )
}

function LanguagesIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      role='img'
      aria-hidden='true'
    >
      <path d='m5 8 6 6' />
      <path d='m4 14 6-6 2-3' />
      <path d='M2 5h12' />
      <path d='M7 2h1' />
      <path d='m22 22-5-10-5 10' />
      <path d='M14 18h6' />
    </svg>
  )
}

function ClipboardListIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      role='img'
      aria-hidden='true'
    >
      <rect x='8' y='2' width='8' height='4' rx='1' />
      <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
      <path d='M12 11h4' />
      <path d='M12 16h4' />
      <path d='M8 11h.01' />
      <path d='M8 16h.01' />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      role='img'
      aria-hidden='true'
    >
      <rect x='2' y='4' width='20' height='16' rx='2' />
      <path d='m10 9 5 3-5 3Z' />
    </svg>
  )
}

function HeadphonesIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      role='img'
      aria-hidden='true'
    >
      <path d='M3 14h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-3Zm0 0a9 9 0 0 1 18 0m0 0v3a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3Z' />
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      role='img'
      aria-hidden='true'
    >
      <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z' />
      <path d='M14 2v6h6' />
      <path d='M16 13H8' />
      <path d='M16 17H8' />
      <path d='M10 9H8' />
    </svg>
  )
}

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen: <BookOpenIcon />,
  Languages: <LanguagesIcon />,
  ClipboardList: <ClipboardListIcon />,
  Video: <VideoIcon />,
  Headphones: <HeadphonesIcon />,
  FileText: <FileTextIcon />,
}

export function CardIcon({ name }: { name: string }) {
  return <>{ICON_MAP[name] ?? null}</>
}
