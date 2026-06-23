export function PracticeHeaderSection({
  typeLabel,
  contextDesc,
}: {
  typeLabel: string
  contextDesc: string
}) {
  return (
      <header className='text-center'>
      <div className="flex justify-center items-center gap-10">
        <div className="flex flex-col items-center text-center">
          <span className='inline-block px-4 py-1 bg-muted text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-0'>
            Part 5 Practice
          </span>
          <h1 className='text-3xl font-bold text-foreground mb-3'>{typeLabel}</h1>
        </div>
        <div className="flex flex-col items-center text-left">
          <p className='text-muted-foreground max-w-2xl mx-auto italic text-sm'>{contextDesc}</p>
        </div>
      </div>
    </header>
  )
}
