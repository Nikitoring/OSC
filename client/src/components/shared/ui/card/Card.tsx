// components/ui/Card.tsx
import { ReactNode } from 'react'
import './card.css'
import OscButton from '../buttons/Button'
import { X } from 'lucide-react'

type Padding = 1 | 2 | 3 | 4 | 5

interface CardProps {
  children: ReactNode
  className?: string
  padding?: Padding
  hover?: boolean
  closable?: boolean
  onClick?: () => void
  onClose?: () => void
}

export function Card({
  children,
  className = '',
  padding = 4,
  hover = false,
  closable = false,
  onClick,
  onClose,
}: CardProps) {
  const classes = [
    'card',
    `osc-pa-${padding}`,
    'osc-flex osc-flex-column',
    hover && 'card--hover',
    onClick && 'card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} onClick={onClick}>
      {closable && (
        <div className={`osc-self-end closable`}>
          <OscButton size="xs" variant="transparent" onClick={onClose}>
            <X></X>
          </OscButton>
        </div>
      )}
      {children}
    </div>
  )
}
