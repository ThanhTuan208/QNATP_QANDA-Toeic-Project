import { LandingNavSection } from '@/features/landing/components/sections/LandingNavSection'
import { PracticeCardsSection } from '@/features/landing/components/sections/PracticeCardsSection'

export default function Home() {
  return (
    <div className='min-h-screen bg-background'>
      <LandingNavSection />
      <main className='mx-auto max-w-5xl px-4 py-12'>
        <header className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-foreground mb-3'>Luyện thi TOEIC Reading</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Chọn dạng câu hỏi để bắt đầu luyện tập. Mỗi dạng có bảng kiến thức và bài tập tương tác
            giúp bạn nắm vững cấu trúc ngữ pháp TOEIC Part 5 & 6.
          </p>
        </header>
        <PracticeCardsSection />
      </main>
    </div>
  )
}
