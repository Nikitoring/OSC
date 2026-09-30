import React from 'react'
import { Badge, type BadgeVariant } from './Badge'
import type { HelpState, HelpType } from '@/domains/domains'

export interface HelpEvent {
  type: HelpType
  state: HelpState
  createdAt: Date
}

interface HelpBadgeProps {
  event: HelpEvent
  className?: string
}

const helpLabels: Record<HelpType, { needed: string; resolved: string }> = {
  food: { needed: 'Нужна еда', resolved: 'Решено' },
  medical: { needed: 'Нужна помощь', resolved: 'Решено' },
  home: { needed: 'Нужен дом', resolved: 'Решено' },
}

// resolved всегда зелёный, needed — цвет своего типа
const typeToVariant: Record<HelpType, BadgeVariant> = {
  food: 'food',
  medical: 'medical',
  home: 'home',
}

export const HelpBadge: React.FC<HelpBadgeProps> = ({ event, className }) => {
  const variant = event.state === 'resolved' ? 'resolved' : typeToVariant[event.type]

  const label = helpLabels[event.type][event.state]

  return <Badge variant={variant} label={label} className={className} />
}
