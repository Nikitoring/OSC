import { Mars, Venus, VenusAndMars, type LucideIcon } from 'lucide-react'
import styles from './catGender.module.css'
import type { Cat } from '@/domains/domains'

export const СatGenderIcon = ({
  cat,
  iconSize,
  info = false,
}: {
  cat: Cat
  iconSize?: 'medium' | 'large'
  info?: boolean
}) => {
  const sizeMap = { medium: 32, large: 40 }
  const iconSizePx = iconSize ? sizeMap[iconSize] : 16

  let IconComponent: LucideIcon
  let colorClass: string
  let textLabel: string

  if (cat?.gender === 'male') {
    IconComponent = Mars
    colorClass = styles['cat-male']
    textLabel = 'Самец'
  } else if (cat?.gender === 'female') {
    IconComponent = Venus
    colorClass = styles['cat-women']
    textLabel = 'Самка'
  } else {
    IconComponent = VenusAndMars
    colorClass = styles['cat-unknown']
    textLabel = 'Неизвестно'
  }

  return (
    <span className={`${styles['gender-wrapper']} ${colorClass}`}>
      <IconComponent size={iconSizePx} />
      {info && <span>{textLabel}</span>}
    </span>
  )
}
