import { useEffect, useState } from 'react'
import { Card } from '../../components/shared/ui/card/Card'
import type { Cat, HelpRequest } from '@/domains/domains'
import { HelpBadge } from '../../components/shared/ui/badge/HelpBadge'

const LastObservation = () => {
  const [observations, setObservations] = useState<(HelpRequest & Cat)[]>([])
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  const catPlaceholderPhotos = [
    '/placeholders/cats-avatars/cat-avatar-01.png',
    '/placeholders/cats-avatars/cat-avatar-02.png',
    '/placeholders/cats-avatars/cat-avatar-03.png',
    '/placeholders/cats-avatars/cat-avatar-04.png',
    '/placeholders/cats-avatars/cat-avatar-05.png',
    '/placeholders/cats-avatars/cat-avatar-06.png',
    '/placeholders/cats-avatars/cat-avatar-07.png',
    '/placeholders/cats-avatars/cat-avatar-08.png',
    '/placeholders/cats-avatars/cat-avatar-09.png',
  ]
  const currentPlaceholder = (id: number) => catPlaceholderPhotos[id % catPlaceholderPhotos.length]
  useEffect(() => {
    setObservations([
      {
        name: 'Рыжик',
        type: 'food',
        state: 'needed',
        createdAt: new Date(),
        id: 1,
        createdAt: new Date(),
        avatar: currentPlaceholder(1),
      },
      {
        name: 'Барсик',
        id: 2,
        type: 'medical',
        state: 'needed',
        createdAt: new Date(),
        avatar: currentPlaceholder(2),
      },
    ])
  }, [])
  return (
    <Card>
      <h3 className="osc-mb-0">Последние наблюдения</h3>
      <hr className="osc-divider" />
      <div className="osc-flex osc-flex-column osc-gap-3">
        {observations.map((observation) => (
          <div key={observation.id} className="osc-flex osc-items-center osc-gap-3">
            <img
              src={observation.avatar}
              alt={observation.id}
              style={{ width: '50px', height: '50px' }}
            />
            <div>
              <h4 className="osc-mt-0 osc-mb-1">{observation.name}</h4>
              <p className="osc-text-gray-500 osc-text-xs osc-mt-0">
                {observation.createdAt.toLocaleDateString('ru-RU', options)}
              </p>
              <HelpBadge key={observation.type} event={observation} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default LastObservation
