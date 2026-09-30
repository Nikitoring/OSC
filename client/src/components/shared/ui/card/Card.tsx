// components/ui/Card.tsx
import { ReactNode } from 'react'
import './card.css'

type Padding = 1 | 2 | 3 | 4 | 5

interface CardProps {
  children: ReactNode
  className?: string
  padding?: Padding
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', padding = 4, hover = false, onClick }: CardProps) {
  const classes = [
    'card',
    `osc-pa-${padding}`,
    hover && 'card--hover',
    onClick && 'card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  )
}
