export default function PracticeTopicLoading() {
  return (
    <div className='space-y-8 animate-pulse'>
      <div className='space-y-2'>
        <div className='h-8 w-48 bg-muted rounded-lg' />
        <div className='h-4 w-72 bg-muted rounded-md' />
      </div>

      <div className='space-y-4'>
        <div className='h-6 w-36 bg-muted rounded-md' />
        <div className='space-y-3'>
          <div className='h-32 bg-muted rounded-xl' />
          <div className='h-32 bg-muted rounded-xl' />
          <div className='h-32 bg-muted rounded-xl' />
        </div>
      </div>
    </div>
  )
}
