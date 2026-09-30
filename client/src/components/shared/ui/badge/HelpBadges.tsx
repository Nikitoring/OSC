import React from 'react'
import { HelpBadge, type HelpEvent } from './HelpBadge'

interface HelpBadgesProps {
  events: HelpEvent[]
  className?: string
}

/**
 * Группируем типы событий и берем по последнему
 * Порядок: food → medical → home
 */
const getLatestByType = (events: HelpEvent[]): HelpEvent[] => {
  const map = new Map<HelpEvent['type'], HelpEvent>()

  for (const event of events) {
    const existing = map.get(event.type)
    if (!existing || new Date(event.createdAt) > new Date(existing.createdAt)) {
      map.set(event.type, event)
    }
  }

  const order: HelpEvent['type'][] = ['food', 'medical', 'home']
  return order.filter((type) => map.has(type)).map((type) => map.get(type)!)
}

export const HelpBadges: React.FC<HelpBadgesProps> = ({ events, className }) => {
  const latest = getLatestByType(events)

  if (latest.length === 0) return null

  return (
    <div className={`osc-flex osc-flex-wrap osc-gap-2 ${className ?? ''}`}>
      {latest.map((event) => (
        <HelpBadge key={event.type} event={event} />
      ))}
    </div>
  )
}
