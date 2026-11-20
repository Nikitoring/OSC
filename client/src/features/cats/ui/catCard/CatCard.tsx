import { Card } from '../../../../components/shared/ui/card/Card'
import type { Cat } from '@/domains/domains'
import { CalendarDays, MapPin } from 'lucide-react'
import styles from './cat.module.css'
import { HelpBadges } from '../../../../components/shared/ui/badge/HelpBadges'
import OscButton from '@/components/shared/ui/buttons/Button'
import { currentPlaceholder } from '@/utils/catCardHeaderPlaceholder'
import L from 'leaflet'
import { geocoders } from 'leaflet-control-geocoder'
import { useEffect, useState } from 'react'
import { СatGenderIcon } from '@/components/shared/catGenderIcon/СatGenderIcon'

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
    <Card className={styles['cat-card']} closable={closable} onClose={onCloseCard}>
      <div
        className={styles['cat-card-content']}
      >
        <div className={styles['cat-card-main']}>
          <div className={styles['cat-header-image-container']}>
            <img
              src={cat.photos?.[0]?.url || currentPlaceholder(cat.id)}
              alt={`Фото кота ${cat.name}`}
            />
          </div>
          <div className={styles['cat-title']}>
            <h2>{cat?.name}</h2>
            {СatGenderIcon({ cat, info: true })}
          </div>
          <div className={styles['cat-meta']}>
            <div className={`osc-text-gray-500 osc-text-sm ${styles['cat-address']}`}>
              <MapPin size={18} aria-hidden="true" />
              <span>{address}</span>
            </div>
            {cat.created_at && (
              <div className="osc-text-gray-500 osc-text-sm">
                <CalendarDays size={18} aria-hidden="true" />
                <span>
                  Добавлен {new Date(cat.created_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
          <HelpBadges events={cat?.help || []} />
        </div>
        <div className={styles['cat-card-details']}>
          <section className={styles['cat-description']}>
            <h3>О коте</h3>
            <p className="osc-text-gray-700 osc-text-sm">
              {cat?.description || 'Описание пока не добавлено.'}
            </p>
          </section>
          {!!cat.photos?.length && cat.photos.length > 1 && (
            <div className={styles['cat-photos-container']} aria-label="Фотографии кота">
              {cat.photos.slice(1).map((photo) => (
                <img key={photo.id} src={photo.url} alt={`Фото кота ${cat.name}`} loading="lazy" />
              ))}
            </div>
          )}
        </div>

        <div className={styles['cat-card-actions']}>
          <OscButton
            variant="primary"
            size="small"
            to={`/cats/${cat?.id}`}
            className="osc-mb-2"
            full
          >
            Посмотреть кота
          </OscButton>
        </div>
      </div>
    </Card>
  )
}

export default CatCard
