import { JsonImporter } from '@/features/admin/components/JsonImporter'

export default function AdminQuestionsPage() {
  return (
    <div className='space-y-8'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground'>Quản lý câu hỏi</h1>
        <p className='mt-2 text-muted-foreground'>Import câu hỏi từ file JSON</p>
      </div>

      <div className='bg-card p-8 rounded-3xl border border-border shadow-sm'>
        <p className='text-muted-foreground'>
          Sử dụng nút <strong>+</strong> ở góc dưới bên phải để import câu hỏi mới.
        </p>
      </div>

      <JsonImporter />
    </div>
  )
}
