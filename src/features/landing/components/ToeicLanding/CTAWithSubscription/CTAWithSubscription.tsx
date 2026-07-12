import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/common/Button'

export function CTAWithSubscription() {
  return (
    <section className='py-4 md:pb-0-12 lg:pb-16 bg-green-bright'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12'>
        <div className='relative bg-card rounded-2xl md:rounded-[3rem] p-6 sm:p-10 md:p-12 lg:p-16 overflow-hidden border border-border soft-depth flex flex-col items-center text-center'>
          <div className='absolute top-0 left-0 w-full h-2 bg-primary' />
          <div className='relative z-10 max-w-xl'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 md:mb-6 tracking-tight'>
              Sẵn sàng để đột phá điểm số?
            </h2>
            <p className='text-sm sm:text-base md:text-lg text-muted-foreground mb-8 md:mb-12 opacity-80'>
              Chinh phục 750+ TOEIC không khó như bạn nghĩ. Hàng nghìn người đã làm được, và người
              tiếp theo chính là bạn!
            </p>
            <div className='flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full max-w-lg mx-auto'>
              <Button
                icon={<ArrowUpRight />}
                iconPosition='right'
                className='w-full sm:w-auto whitespace-nowrap font-bold px-6 py-3 md:px-8 md:py-6 rounded-xl bg-primary hover:bg-green-teal shadow-lg text-primary-foreground hover:shadow-xl hover:shadow-primary/30 active:scale-95 text-sm md:text-base'
              >
                Ngay luôn nhé
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
