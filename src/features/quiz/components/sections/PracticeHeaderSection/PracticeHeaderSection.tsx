export function PracticeHeaderSection({
  typeLabel,
  contextDesc,
}: {
  typeLabel: string
  contextDesc: string
}) {
  return (
    <header className='text-center'>
      <span className='inline-block px-4 py-1 bg-muted text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4'>
        Part 5 Practice
      </span>
      <h1 className='text-3xl font-bold text-foreground mb-3'>{typeLabel}</h1>
      <p className='text-muted-foreground max-w-2xl mx-auto italic text-sm'>{contextDesc}</p>
    </header>
  )
}
