import { notFound } from 'next/navigation'
import { practiceModules } from '@/constants/sidebar.constants'
import { PracticeTopicView } from '@/features/quiz/components/sections/PracticeTopicView'

interface TopicPageProps {
  params: Promise<{ module: string; topic: string }>
}

export default async function PracticeTopicPage({ params }: TopicPageProps) {
  const { module: moduleId, topic: topicSlug } = await params
  const practiceModule = practiceModules.find((m) => m.id === moduleId)
  if (!practiceModule) notFound()

  const topic = practiceModule.topics.find((t) => t.slug === topicSlug)
  if (!topic) notFound()

  return <PracticeTopicView practiceModule={practiceModule} topic={topic} />
}
