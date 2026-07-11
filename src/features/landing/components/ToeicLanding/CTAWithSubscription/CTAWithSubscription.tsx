import { Button } from '@/components/common/Button'

export function CTAWithSubscription() {
  return (
    <section className='py-24 bg-green-bright'>
      <div className='max-w-7xl mx-auto px-12'>
        <div className='relative bg-card rounded-[3rem] p-12 lg:p-24 overflow-hidden border border-border soft-depth flex flex-col items-center text-center'>
          <div className='absolute top-0 left-0 w-full h-2 bg-primary' />
          <div className='relative z-10 max-w-2xl'>
            <h2 className='text-4xl lg:text-5xl font-extrabold text-foreground mb-6 tracking-tight'>
              Sẵn sàng để đột phá điểm số?
            </h2>
            <p className='text-lg text-muted-foreground mb-12 opacity-80'>
              Hàng nghìn học viên đã đạt được 750+ TOEIC nhờ hệ thống lộ trình AI thông minh. Nhận
              lộ trình cá nhân hóa ngay hôm nay.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto'>
              <input
                type='email'
                placeholder='Nhập email của bạn'
                className='w-full px-7 py-4 rounded-2xl border border-input focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background transition-all'
              />
              <Button className='w-full sm:w-auto whitespace-nowrap px-10 py-4 rounded-2xl bg-primary text-primary-foreground hover:shadow-xl hover:shadow-primary/30 active:scale-95'>
                Nhận lộ trình
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
