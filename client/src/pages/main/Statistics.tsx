import { useEffect, useState } from 'react'
import { Card } from '../../components/shared/ui/card/Card'
import { Cat, Beef, Heart } from 'lucide-react'
import style from './stats.module.css'
import { useCatsStats } from '@/features/cats/queries/cats.queries'
type StatsTypes = 'all_cats' | 'food' | 'medical'

const StatTitle = ({ type }: { type: StatsTypes }) => {
  let typeIcon = <Cat></Cat>
  let typeTitle = 'Всего котов'
  switch (true) {
    case type === 'food':
      typeTitle = 'Покормлено'
      typeIcon = <Beef className="osc-text-orange"></Beef>
      break
    case type === 'medical':
      typeTitle = 'Вылечено'
      typeIcon = <Heart className="osc-text-orange"></Heart>
      break
    default:
      typeIcon = <Cat></Cat>
      typeTitle = 'Всего котов'
      break
  }
  type === 'all_cats' ? Cat : type === 'food' ? Beef : Heart

  return (
    <div className="osc-flex osc-gap-2 osc-items-center">
      {typeIcon}
      {typeTitle}
    </div>
  )
}

const Stats = () => {
  const { data: statistics } = useCatsStats()
  return (
    <Card className="osc-bg">
      <h3 className="osc-mb-0">Статистика</h3>
      <hr className="osc-divider" />
      <div className={style['stats-list']}>
        {statistics &&
          Object.entries(statistics).map(([type, value]) => (
            <div key={type} className={style['stat-item']}>
              <Card>
                <StatTitle type={type} />
                <h1 className="osc-my-4 osc-self-center" style={{ fontSize: '3rem' }}>
                  {value || '-'}
                </h1>
              </Card>
            </div>
          ))}
      </div>
    </Card>
  )
}

export default Stats
