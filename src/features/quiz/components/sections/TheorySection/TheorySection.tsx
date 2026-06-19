import { getTheoryContent } from '@/features/quiz/controllers/theory.controller'

export function TheorySection({ type }: { type: string }) {
  const data = getTheoryContent(type)

  return (
    <section className='bg-card p-8 rounded-3xl border border-border shadow-sm'>
      <h3 className='text-2xl font-bold mb-6 text-center'>{data.title}</h3>
      <p className='text-muted-foreground mb-8 text-center max-w-2xl mx-auto text-sm'>
        Sử dụng bảng này để ôn tập nhanh các quy tắc cốt lõi giúp bạn xử lý nhanh câu hỏi trong phần
        này.
      </p>
      {data.content}
    </section>
  )
}
