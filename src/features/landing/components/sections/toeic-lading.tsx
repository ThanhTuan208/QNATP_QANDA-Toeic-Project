'use client'

import {
  ArrowRight,
  BookOpen,
  Brain,
  FileText,
  Headphones,
  Image,
  ListChecks,
  MessageSquare,
  Mic,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/common/Button/button'
import { SiteHeader } from '@/components/layout/SiteHeader/site-header'
import { PracticeCardsSection } from './PracticeCardsSection'

export default function TOEICLanding() {
  return (
    <>
      <SiteHeader
        actions={
          <div className='flex items-center gap-4'>
            <Link
              href='/login'
              className='px-5 py-2.5 text-xs sm:text-sm font-bold text-foreground border border-border rounded-md hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all'
            >
              Đăng nhập
            </Link>
            <Link
              href='/register'
              className='px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground bg-primary rounded-md hover:opacity-90 active:scale-95 transition-all'
            >
              Đăng ký
            </Link>
          </div>
        }
      />

      <main className='pt-20 bg-background text-foreground'>
        {/* Hero Section */}
        <section className='relative overflow-hidden bg-green-bright py-24 lg:py-36'>
          <div className='max-w-7xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10'>
            <div className='flex flex-col gap-8'>
              <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground w-fit text-xs font-medium'>
                <Zap className='h-4 w-4' />
                AI-DRIVEN PERSONALIZATION
              </div>
              <h1 className='text-4xl lg:text-5xl font-extrabold text-foreground leading-[1.1] tracking-tight'>
                Master TOEIC with <br />
                <span className='text-primary'>Intelligence</span> &amp; Ease.
              </h1>
              <p className='text-lg text-muted-foreground max-w-lg leading-relaxed'>
                Cá nhân hóa lộ trình học tập, luyện tập cùng trợ lý AI và đạt mục tiêu điểm số mơ
                ước chỉ trong 30 ngày.
              </p>
              <div className='flex flex-wrap gap-5 pt-4'>
                <Button className='px-10 py-4 rounded-2xl bg-safety-orange text-white hover:shadow-xl hover:shadow-safety-orange/30 active:scale-95'>
                  Bắt đầu ngay
                </Button>
                <Button
                  buttonType='outline'
                  className='px-10 py-4 rounded-2xl text-primary hover:bg-primary/5'
                >
                  Luyện đề mẫu
                </Button>
              </div>
            </div>

            <div className='relative'>
              <div className='w-full aspect-[4/3] rounded-3xl overflow-hidden soft-depth relative'>
                <img
                  className='w-full h-full object-cover'
                  alt='Modern workspace'
                  src='https://lh3.googleusercontent.com/aida-public/AB6AXuArGLqk6G1xULOaAwPOrmLbAwnVCVpyAZSBHvWC8hZrKyK7tQ6DWaMo5AZGCswxIclDn-DIJdyrwdm6cBHVEbXiOxER3fUQSHTZ3OzLE2L0LOfGDNogQ_NelbT0-u06qJVNvYm8-ZXy9i8mqIT94UtPlzRYhjCiT02LGBCk6S5McRQbKtJoZqZKSSCRQZHsHKUnSPlfUqQkliHR-3gxiVKP6o_4HOr7uuc6513sQ5iRqlmnUat2Jqz4yg'
                />
                <div className='absolute bottom-8 left-8 right-8 glass-card p-6 rounded-2xl flex items-center gap-5'>
                  <div className='w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground'>
                    <TrendingUp className='h-6 w-6' />
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>Tiến độ vượt bậc</p>
                    <p className='text-xs text-muted-foreground'>+150 điểm chỉ sau 2 tuần</p>
                  </div>
                </div>
              </div>
              <div className='absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10' />
              <div className='absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -z-10' />
            </div>
          </div>
        </section>

        {/* Practice Section */}
        <section className='py-32 bg-card'>
          <div className='max-w-7xl mx-auto px-12'>
            <div className='text-center mb-20'>
              <div className='inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/5 text-primary mb-6 text-xs font-medium tracking-wide'>
                LỘ TRÌNH CHUẨN HÓA
              </div>
              <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-4'>
                Luyện tập theo từng kỹ năng
              </h2>
              <p className='text-base text-muted-foreground max-w-2xl mx-auto opacity-80'>
                Hệ thống câu hỏi sát thực tế, được phân loại chi tiết giúp bạn tập trung vào những
                phần còn yếu.
              </p>
            </div>

            <PracticeCardsSection />

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
              {/* Listening Skills Group */}
              <div className='flex flex-col gap-10'>
                <div className='flex items-center justify-between border-b border-border pb-6'>
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 flex items-center justify-center rounded-xl bg-accent text-accent-foreground'>
                      <Headphones className='h-5 w-5' />
                    </div>
                    <h3 className='text-2xl font-semibold'>Listening Skills</h3>
                  </div>
                  <span className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>
                    Parts 1 - 4
                  </span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  {/* Part 1 */}
                  <div className='group skill-card-hover bg-card p-7 rounded-2xl border border-border soft-depth cursor-pointer'>
                    <div className='flex justify-between items-start mb-8'>
                      <div className='w-11 h-11 rounded-xl bg-green-bright flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300'>
                        <Image className='h-5 w-5' />
                      </div>
                      <span className='px-2.5 py-1 rounded-lg bg-green-teal-10 text-muted-foreground text-xs font-medium'>
                        Part 1
                      </span>
                    </div>
                    <p className='text-sm text-muted-foreground'>Câu hỏi về hình ảnh</p>
                    <h4 className='text-xl font-semibold mb-6'>Photographs</h4>
                    <div className='flex justify-between items-center'>
                      <span className='px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium'>
                        45 Bài tập
                      </span>
                      <ArrowRight className='h-5 w-5 text-primary group-hover:translate-x-1 transition-transform' />
                    </div>
                  </div>

                  {/* Part 2 */}
                  <div className='group skill-card-hover bg-card p-7 rounded-2xl border border-border soft-depth cursor-pointer'>
                    <div className='flex justify-between items-start mb-8'>
                      <div className='w-11 h-11 rounded-xl bg-green-bright flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300'>
                        <MessageSquare className='h-5 w-5' />
                      </div>
                      <span className='px-2.5 py-1 rounded-lg bg-green-teal-10 text-muted-foreground text-xs font-medium'>
                        Part 2
                      </span>
                    </div>
                    <p className='text-sm text-muted-foreground'>Câu hỏi phản xạ</p>
                    <h4 className='text-xl font-semibold mb-6'>Question-Response</h4>
                    <div className='flex justify-between items-center'>
                      <span className='px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium'>
                        45 Bài tập
                      </span>
                      <ArrowRight className='h-5 w-5 text-primary group-hover:translate-x-1 transition-transform' />
                    </div>
                  </div>

                  {/* Parts 3 & 4 */}
                  <div className='sm:col-span-2 space-y-4'>
                    <div className='group flex items-center justify-between p-5 bg-card rounded-2xl border border-border skill-card-hover cursor-pointer'>
                      <div className='flex items-center gap-5'>
                        <div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all'>
                          <Users className='h-5 w-5' />
                        </div>
                        <div>
                          <p className='text-xs font-medium text-primary mb-0.5'>Part 3</p>
                          <h4 className='text-sm font-semibold'>Short Conversations</h4>
                        </div>
                      </div>
                      <Button className='px-5 py-2 rounded-xl bg-primary/5 text-primary text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all'>
                        Luyện tập
                      </Button>
                    </div>
                    <div className='group flex items-center justify-between p-5 bg-card rounded-2xl border border-border skill-card-hover cursor-pointer'>
                      <div className='flex items-center gap-5'>
                        <div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all'>
                          <Mic className='h-5 w-5' />
                        </div>
                        <div>
                          <p className='text-xs font-medium text-primary mb-0.5'>Part 4</p>
                          <h4 className='text-sm font-semibold'>Short Talks</h4>
                        </div>
                      </div>
                      <Button className='px-5 py-2 rounded-xl bg-primary/5 text-primary text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all'>
                        Luyện tập
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reading Skills Group */}
              <div className='flex flex-col gap-10'>
                <div className='flex items-center justify-between border-b border-border pb-6'>
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 flex items-center justify-center rounded-xl bg-warning-soft text-warning-foreground'>
                      <BookOpen className='h-5 w-5' />
                    </div>
                    <h3 className='text-2xl font-semibold'>Reading Skills</h3>
                  </div>
                  <span className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>
                    Parts 5 - 7
                  </span>
                </div>
                <div className='flex flex-col gap-6'>
                  {/* Part 5 Featured */}
                  <div className='group relative bg-card p-10 rounded-3xl border border-border soft-depth overflow-hidden skill-card-hover cursor-pointer'>
                    <div className='absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-[100px] transition-transform group-hover:scale-110' />
                    <div className='relative z-10'>
                      <div className='flex items-center gap-5 mb-8'>
                        <div className='w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-primary'>
                          <ListChecks className='h-7 w-7' />
                        </div>
                        <div>
                          <p className='text-xs font-medium text-primary uppercase tracking-wider mb-0.5'>
                            Part 5
                          </p>
                          <h4 className='text-2xl font-semibold'>Incomplete Sentences</h4>
                        </div>
                      </div>
                      <p className='text-base text-muted-foreground mb-10 max-w-sm leading-relaxed opacity-90'>
                        Tập trung vào ngữ pháp và từ vựng cốt lõi. Hệ thống 1,200+ câu hỏi được cập
                        nhật mới nhất.
                      </p>
                      <div className='flex items-center gap-6'>
                        <Button className='px-8 py-3.5 rounded-2xl bg-safety-orange text-white hover:shadow-lg hover:shadow-safety-orange/30'>
                          Bắt đầu ngay
                        </Button>
                        <span className='text-xs text-muted-foreground'>30 câu &bull; 15 phút</span>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    {/* Part 6 */}
                    <div className='group bg-card p-7 rounded-2xl border border-border skill-card-hover cursor-pointer'>
                      <div className='flex justify-between items-start mb-6'>
                        <div>
                          <p className='text-xs font-medium text-primary mb-0.5'>Part 6</p>
                          <h4 className='text-xl font-semibold'>Text Completion</h4>
                        </div>
                        <FileText className='h-5 w-5 text-primary opacity-40 group-hover:opacity-100 transition-opacity' />
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium'>
                          45 Bài tập
                        </span>
                        <ArrowRight className='h-5 w-5 text-primary group-hover:translate-x-1 transition-transform' />
                      </div>
                    </div>
                    {/* Part 7 */}
                    <div className='group bg-primary p-7 rounded-2xl soft-depth cursor-pointer relative overflow-hidden text-primary-foreground skill-card-hover'>
                      <div className='relative z-10'>
                        <p className='text-xs font-medium opacity-80 mb-0.5'>Part 7</p>
                        <h4 className='text-xl font-semibold mb-6'>Comprehension</h4>
                        <div className='flex justify-between items-center'>
                          <span className='px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium'>
                            Thử thách khó
                          </span>
                          <Brain className='h-5 w-5 opacity-60' />
                        </div>
                      </div>
                      <div className='absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-24 bg-green-bright'>
          <div className='max-w-7xl mx-auto px-12'>
            <div className='relative bg-card rounded-[3rem] p-12 lg:p-24 overflow-hidden border border-border soft-depth flex flex-col items-center text-center'>
              <div className='absolute top-0 left-0 w-full h-2 bg-primary' />
              <div className='relative z-10 max-w-2xl'>
                <h2 className='text-4xl lg:text-5xl font-extrabold text-foreground mb-6 tracking-tight'>
                  Sẵn sàng để đột phá điểm số?
                </h2>
                <p className='text-lg text-muted-foreground mb-12 opacity-80'>
                  Hàng nghìn học viên đã đạt được 750+ TOEIC nhờ hệ thống lộ trình AI thông minh.
                  Nhận lộ trình cá nhân hóa ngay hôm nay.
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
      </main>

      {/* Footer */}
      <footer className='w-full bg-card border-t border-border'>
        <div className='max-w-7xl mx-auto px-12 py-16 flex flex-col md:flex-row justify-between items-center gap-10'>
          <div className='flex flex-col items-center md:items-start gap-4'>
            <div className='text-xl font-bold text-primary tracking-tight'>TOEIC Mastery</div>
            <p className='text-sm text-muted-foreground max-w-xs text-center md:text-left opacity-70'>
              Ứng dụng học tập thông minh giúp bạn chinh phục đỉnh cao ngôn ngữ với trải nghiệm hiện
              đại.
            </p>
          </div>
          <div className='flex flex-wrap justify-center gap-10 text-sm font-semibold text-muted-foreground'>
            <a href='#' className='hover:text-primary transition-colors'>
              Điều khoản
            </a>
            <a href='#' className='hover:text-primary transition-colors'>
              Bảo mật
            </a>
            <a href='#' className='hover:text-primary transition-colors'>
              Hỗ trợ
            </a>
            <a href='#' className='hover:text-primary transition-colors'>
              Tuyển dụng
            </a>
          </div>
          <div className='text-sm text-muted-foreground opacity-60'>
            &copy; 2024 TOEIC Mastery. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
