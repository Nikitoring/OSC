import React from 'react'
import { BriefcaseMedical, CircleCheck, Beef, House, type LucideIcon } from 'lucide-react'
import './badge.css'

export type BadgeVariant = 'food' | 'medical' | 'home' | 'resolved'

interface BadgeProps {
  variant: BadgeVariant
  label: string
  className?: string
}

const variantConfig: Record<BadgeVariant, { bg: string; Icon: LucideIcon }> = {
  food: { bg: 'osc-bg-orange', Icon: Beef },
  medical: { bg: 'osc-bg-pink', Icon: BriefcaseMedical },
  home: { bg: 'osc-bg-purple', Icon: House },
  resolved: { bg: 'osc-bg-green', Icon: CircleCheck },
}

export const Badge: React.FC<BadgeProps> = ({ variant, label, className = '' }) => {
  const { bg, Icon } = variantConfig[variant]

  return (
    <span
      className={`
        osc-inline-flex osc-flex-wrap osc-items-center osc-gap-2
        osc-px-4 osc-py-1 osc-rounded-2xl
        osc-text-white osc-font-semibold osc-text-xs
        ${bg}
        badge
        ${className}
      `}
      aria-label={label}
      title={label}
    >
      <Icon size="1rem" aria-hidden="true" />
      <span className="badge-label">{label}</span>
    </span>
  )
}
