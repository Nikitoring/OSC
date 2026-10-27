import type { HelpRequestDto } from '@/features/help/api/helpApi'
import { Beef, House, BriefcaseMedical, type LucideIcon } from 'lucide-react'
import styles from './helpRequestBadge.module.css'
import { formatRelativeDate } from '@/utils/formatedDate'

const HelpRequestBadge = ({ request }: { request: HelpRequestDto }) => {
  let IconComponent: LucideIcon = Beef
  let colorClass: string = ''
  let textLabel: string = ''

  if (request.type === 'food') {
    IconComponent = Beef
    colorClass = styles['food']
    textLabel = 'Нужна еда'
  } else if (request.type === 'home') {
    IconComponent = House
    colorClass = styles['house']
    textLabel = 'Нужен дом'
  } else if (request.type === 'medical') {
    IconComponent = BriefcaseMedical
    colorClass = styles['medical']
    textLabel = 'Нужна помощь (мед.)'
  }
  return (
    <span className={`${styles['badge-wrapper']}`}>
      <IconComponent size={40} className={colorClass} />
      <div>
        <h4 className="osc-color-black osc-my-0">{textLabel}</h4>
        <span className="osc-text-gray-700">
          {request.createdAt && formatRelativeDate(request.createdAt)}
        </span>
      </div>
    </span>
  )
}

export default HelpRequestBadge
