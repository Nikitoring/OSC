import { Card } from '../../../../components/shared/ui/card/Card'
import type { Cat } from '@/domains/domains'
import { Navigation } from 'lucide-react'
import styles from './cat.module.css'
import { HelpBadges } from '../../../../components/shared/ui/badge/HelpBadges'
import OscButton from '@/components/shared/ui/buttons/Button'
import { currentPlaceholder } from '@/utils/catCardHeaderPlaceholder'
import { catGenderIcon } from '@/components/shared/catGenderIcon/catGenderIcon'
import L from 'leaflet'
import { geocoders } from 'leaflet-control-geocoder'
import { useEffect, useState } from 'react'

type CatCardProps = {
  cat: Cat
  closable?: boolean
  onClose?: (state: null) => void
}
const geocoder = new geocoders.Nominatim()

const CatCard = ({ cat, closable = false, onClose }: CatCardProps) => {
  const [address, setAddress] = useState<string>('Адрес не указан')

  const onParseLocation = async () => {
    if (cat.latitude && cat.longitude) {
      const latlng = L.latLng(cat.latitude, cat.longitude)
      const res = await geocoder.reverse(latlng, 1e8)
      if (res && res.length) {
        setAddress(res[0].html.replace(/<[^>]*>?/gm, '').trim())
      } else {
        setAddress('Адрес не найден')
      }
    }
  }
  useEffect(() => {
    onParseLocation()
  }, [cat.latitude, cat.longitude])
  const onCloseCard = () => {
    if (closable && onClose) {
      onClose(null)
    }
  }

  return (
    <Card closable={closable} onClose={onCloseCard}>
      <div
        className="osc-flex osc-flex-column osc-justify-between"
        style={{ height: '100%', position: 'relative' }}
      >
        <div>
          <div className={styles['cat-header-image-container']}>
            <img src={currentPlaceholder(cat.id)} alt={cat?.name} style={{ width: '100%' }} />
          </div>
          <div className="osc-flex osc-items-center osc-gap-1">
            <h2 className="osc-mb-1">{cat?.name}</h2>
            {catGenderIcon(cat)}
          </div>
          <div className="osc-text-gray-500 osc-text-sm">{address}</div>
          <HelpBadges events={cat?.help || []} />
        </div>
        <div>
          {cat?.description && <p className="osc-text-gray-700 osc-text-sm">{cat?.description}</p>}
          <div className={styles['cat-photos-container']}> </div>
        </div>

        <div>
          <OscButton
            variant="primary"
            size="small"
            to={`/cat/${cat?.id}`}
            className="osc-mb-2"
            full
          >
            Посмотреть кота
          </OscButton>
          <OscButton variant="secondary" size="small" full>
            <Navigation></Navigation>
            Проложить маршрут
          </OscButton>
        </div>
      </div>
    </Card>
  )
}

export default CatCard
