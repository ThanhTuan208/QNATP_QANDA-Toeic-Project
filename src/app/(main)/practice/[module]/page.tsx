import { notFound, redirect } from 'next/navigation'
import { practiceModules } from '@/constants/sidebar.constant'

export default async function PracticeModulePage({
  params,
}: {
  params: Promise<{ module: string }>
}) {
  const { module: moduleId } = await params
  const practiceModule = practiceModules.find((m) => m.id === moduleId)
  if (!practiceModule) notFound()

  if (practiceModule.topics.length > 0) {
    redirect(`/practice/${moduleId}/${practiceModule.topics[0].slug}`)
  }

  return (
    <div className='flex items-center justify-center min-h-[50vh]'>
      <p className='text-muted-foreground text-lg'>Module này chưa có nội dung.</p>
    </div>
  )
}
