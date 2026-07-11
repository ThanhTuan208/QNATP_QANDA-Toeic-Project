import type { PracticeModule, TopicItem } from '@/types/sidebar'
import { PracticeHeaderSection } from '@/features/quiz/components/Sections/PracticeHeaderSection'
import { QuizSection } from '@/features/quiz/components/Sections/QuizSection'
import { TheorySection } from '@/features/quiz/components/Sections/TheorySection'
import { loadQuestions } from '@/features/quiz/utils/load-questions.utils'

interface PracticeTopicViewProps {
  practiceModule: PracticeModule
  topic: TopicItem
}

export default async function PracticeTopicView({ practiceModule, topic }: PracticeTopicViewProps) {
  const initialQuestions = loadQuestions(topic.slug)

  return (
    <div className='space-y-8'>
      <PracticeHeaderSection
        typeLabel={practiceModule.label}
        contextDesc={practiceModule.description}
      />

      <section id={topic.slug} className='scroll-mt-24'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-foreground'>{topic.label}</h2>
          <p className='text-muted-foreground'>{topic.description}</p>
        </div>

        <div className='space-y-12'>
          {topic.sections.map((section) => {
            const sectionId = `${topic.slug}-${section.id}`
            return (
              <div key={sectionId} id={sectionId} className='scroll-mt-24'>
                {section.id === 'theory' && <TheorySection type={topic.slug} />}
                {section.id === 'practice' && (
                  <QuizSection type={topic.slug} initialQuestions={initialQuestions} />
                )}
                {section.id === 'quiz' && (
                  <QuizSection type={topic.slug} initialQuestions={initialQuestions} />
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
