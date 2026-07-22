'use client'

import { EMAIL_HEADERS } from '@/features/temp-session/constants'
import type { ContentBlock } from '@/features/temp-session/types'
import { cn } from '@/lib/utils'

interface PassageRendererProps {
  blocks?: ContentBlock[]
  content?: string
  passageFormat?: string
  title?: string
}

function EmailPassage({
  blocks,
  content,
  title,
}: {
  blocks?: ContentBlock[]
  content?: string
  title?: string
}) {
  const raw = blocks
    ? blocks
        .filter((b) => b.type === 'text')
        .map((b) => b.value ?? '')
        .join('\n')
    : (content ?? '')

  const lines = raw.split('\n')

  return (
    <div className='font-sans text-sm leading-relaxed space-y-1'>
      {title && (
        <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2'>
          {title}
        </p>
      )}
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i.toString()} className='h-2' />
        const lower = trimmed.toLowerCase()
        const matchedHeader = EMAIL_HEADERS.find((h) => lower.startsWith(h))
        if (matchedHeader) {
          const [label, ...rest] = trimmed.split(':')
          return (
            <p key={i.toString()} className='flex gap-2'>
              <span className='font-bold text-foreground shrink-0 min-w-17.5'>{label}:</span>
              <span className='text-foreground'>{rest.join(':')}</span>
            </p>
          )
        }
        return (
          <p key={i.toString()} className='text-foreground leading-relaxed'>
            {line}
          </p>
        )
      })}
    </div>
  )
}

function TablePassage({ blocks, title }: { blocks?: ContentBlock[]; title?: string }) {
  const tableBlocks = blocks?.filter((b) => b.type === 'table' && b.headers && b.rows) as
    | (ContentBlock & { headers: string[]; rows: string[][] })[]
    | undefined
  const textBlocks = blocks?.filter((b) => b.type === 'text')

  if (!tableBlocks || tableBlocks.length === 0) return null

  return (
    <div className='space-y-4'>
      {title && (
        <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
          {title}
        </p>
      )}
      {tableBlocks.map((tb, idx) => (
        <div key={idx.toString()} className='overflow-x-auto rounded-lg border border-border'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-muted/50'>
                {tb.headers.map((h, ci) => (
                  <th
                    key={ci.toString()}
                    className='px-3 py-2 text-left text-xs font-bold text-muted-foreground border-b border-border'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tb.rows.map((row, ri) => (
                <tr key={ri.toString()} className={cn(ri % 2 === 1 && 'bg-muted/20')}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci.toString()}
                      className='px-3 py-2 text-xs text-foreground border-b border-border/50'
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {textBlocks?.map((b, i) => (
        <p
          key={i.toString()}
          className='text-sm leading-relaxed text-foreground whitespace-pre-line'
        >
          {b.value}
        </p>
      ))}
    </div>
  )
}

function DefaultPassage({ blocks, content, passageFormat, title }: PassageRendererProps) {
  const formatStyles: Record<string, string> = {
    memo: 'border-l-2 border-primary/20 pl-4 italic',
    letter: 'font-serif tracking-wide',
    article: 'columns-1 gap-6',
    advertisement: 'text-center font-bold text-sm uppercase tracking-wider',
    announcement: 'border-l-2 border-amber-400/30 pl-4',
    schedule: 'font-mono text-xs space-y-0.5',
    review: 'italic text-muted-foreground',
    form: 'border border-border/50 rounded-lg p-4 bg-muted/10 font-mono text-xs',
  }

  const extraClass = passageFormat ? formatStyles[passageFormat] : ''

  return (
    <div className={cn('font-serif text-sm leading-relaxed whitespace-pre-line', extraClass)}>
      {title && (
        <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3'>
          {title}
        </p>
      )}
      {blocks
        ? blocks.map((b, i) => {
            if (b.type === 'table') return null
            if (b.type === 'blank')
              return (
                <span
                  key={i.toString()}
                  className='inline-block border-b-2 border-dashed border-primary/60 min-w-35 mx-1'
                >
                  &nbsp;
                </span>
              )
            if (b.type === 'image')
              return (
                <span key={i.toString()} className='text-xs text-muted-foreground italic'>
                  [Image: {b.value}]
                </span>
              )
            return (
              <p key={i.toString()} className='mb-2'>
                {b.value}
              </p>
            )
          })
        : content}
    </div>
  )
}

export function PassageRenderer({ blocks, content, passageFormat, title }: PassageRendererProps) {
  if (passageFormat === 'email') {
    return <EmailPassage blocks={blocks} content={content} title={title} />
  }

  const hasTable = blocks?.some((b) => b.type === 'table')
  if (hasTable && passageFormat !== 'email') {
    return <TablePassage blocks={blocks} title={title} />
  }

  return (
    <DefaultPassage blocks={blocks} content={content} passageFormat={passageFormat} title={title} />
  )
}
