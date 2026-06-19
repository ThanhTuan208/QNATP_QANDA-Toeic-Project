'use client'

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

interface ProgressChartProps {
  correct: number
  total: number
}

const COLORS = ['var(--color-success)', 'var(--color-muted)']

export function ProgressChart({ correct, total }: ProgressChartProps) {
  const data = [
    { name: 'Đúng', value: correct },
    { name: 'Sai/Chưa làm', value: Math.max(total - correct, 0) },
  ]

  return (
    <div className='relative mx-auto' style={{ width: '100%', maxWidth: 300, height: 300 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={100}
            outerRadius={140}
            paddingAngle={0}
            dataKey='value'
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
