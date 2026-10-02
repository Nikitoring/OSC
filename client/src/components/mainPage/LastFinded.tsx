import { useEffect, useState } from 'react'
import { Card } from '../shared/ui/card/Card'
import type { Cat, HelpRequest } from '@/domains/domains'
import CatCard from '../../features/cats/ui/catCard/CatCard'
import { catGenderIcon } from '@/components/shared/catGenderIcon/catGenderIcon'

const LastFinded = () => {
  const [lastCats, setLastFindedCats] = useState<(HelpRequest & Cat)[]>([])
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  const catPlaceholderPhotos = [
    '/placeholders/cats/cat-header-01.png',
    '/placeholders/cats/cat-header-02.png',
    '/placeholders/cats/cat-header-03.png',
    '/placeholders/cats/cat-header-04.png',
    '/placeholders/cats/cat-header-05.png',
    '/placeholders/cats/cat-header-06.png',
    '/placeholders/cats/cat-header-07.png',
    '/placeholders/cats/cat-header-08.png',
    '/placeholders/cats/cat-header-09.png',
  ]
  const currentPlaceholder = (id: number) => catPlaceholderPhotos[id % catPlaceholderPhotos.length]
  useEffect(() => {
    setLastFindedCats([
      {
        name: 'Рыжик',
        type: 'food',
        state: 'needed',
        createdAt: new Date(),
        id: 1,
      },
      {
        name: 'Барсик',
        id: 2,
        type: 'medical',
        state: 'needed',
        createdAt: new Date(),
      },
    ])
  }, [])
  return (
    <Card className="osc-bg-gray-200">
      <h3 className="osc-mb-0">Недавно замечанные</h3>
      <hr className="osc-divider" />
      <div className="osc-flex osc-gap-3">
        {lastCats.map((cat) => (
          <Card key={cat.id}>
            <div
              className="osc-flex osc-flex-column osc-justify-between"
              style={{ height: '100%' }}
            >
              <div>
                <img
                  src={currentPlaceholder(cat.id)}
                  alt={cat?.name}
                  style={{ maxWidth: '7rem' }}
                />
              </div>
              <div className="osc-flex osc-items-center osc-gap-2">
                <h4>{cat.name}</h4>
                {catGenderIcon(cat)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  )
}

export default LastFinded
