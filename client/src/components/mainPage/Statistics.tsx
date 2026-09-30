import { useEffect, useState } from 'react'
import { Card } from '../shared/ui/card/Card'
import { Cat, Drumstick, Heart } from 'lucide-react'

type StatsTypes = 'all' | 'food' | 'medical'

const StatTitle = ({ type }: { type: StatsTypes }) => {
  let typeIcon = <Cat></Cat>
  let typeTitle = 'Всего котов'
  switch (true) {
    case type === 'food':
      typeTitle = 'Покормлено'
      typeIcon = <Drumstick className="osc-text-orange"></Drumstick>
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
  type === 'all' ? Cat : type === 'food' ? Drumstick : Heart

  return (
    <div className="osc-flex osc-gap-2 osc-items-center">
      {typeIcon}
      {typeTitle}
    </div>
  )
}

const Stats = () => {
  const [stats, setStats] = useState<{ type: StatsTypes; count: number }[]>([])

  useEffect(() => {
    setStats([
      { type: 'all', count: 10 },
      { type: 'food', count: 5 },
      { type: 'medical', count: 1 },
    ])
  }, [])

  return (
    <Card className="osc-bg-gray-200">
      <h3 className="osc-mb-0">Статистика</h3>
      <hr className="osc-divider" />
      <div className="osc-flex osc-gap-2">
        {stats.map((stat) => (
          <Card key={stat.type}>
            <StatTitle type={stat.type}></StatTitle>
            <h1 className="osc-my-2">{stat.count || '-'}</h1>
          </Card>
        ))}
      </div>
    </Card>
  )
}

export default Stats
