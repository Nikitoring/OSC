import { useEffect, useState } from 'react'
import { Card } from '../../components/shared/ui/card/Card'
import type { Cat, HelpRequest } from '@/domains/domains'
import CatCard from '../../features/cats/ui/catCard/CatCard'
import { СatGenderIcon } from '@/components/shared/catGenderIcon/СatGenderIcon'
import { useLastCats } from '@/features/cats/queries/cats.queries'

const LastFinded = () => {
  const { data } = useLastCats(5)
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

  return (
    <Card className="osc-bg-gray-200">
      <h3 className="osc-mb-0">Недавно замечанные</h3>
      <hr className="osc-divider" />
      <div className="osc-flex osc-gap-3">
        {data?.map((cat) => (
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
                {СatGenderIcon(cat)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  )
}

export default LastFinded
