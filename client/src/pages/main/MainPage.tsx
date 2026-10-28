import styles from './mainPage.module.css'
import { Map, SearchIcon } from 'lucide-react'
import OscButton from '@/components/shared/ui/buttons/Button'
import { MapWidget } from '../../components/shared/mapWidget/MapWidget'
import { TextInput } from '@/components/shared/ui/textInput/TextInput'
import { GeolocationController } from '@/features/geolocation/GeolocationController'
import CatCard from '../../features/cats/ui/catCard/CatCard'
import LastObservation from './LastObservation'
import LastFinded from './LastFinded'
import Stats from './Statistics'
import { useState } from 'react'
import type { Cat } from '@/domains/domains'
import { CatsLayer } from '@/features/cats/ui/catLayer/CatLayer'

const MainPage = () => {
  const [selectedCat, setSelected] = useState<Cat | null>(null)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <h1>
            КОТЫ НА УЛИЦАХ ЕСТЬ.
            <br />
            <span>МЫ ПОКАЗЫВАЕМ ГДЕ.</span>
          </h1>

          <p>
            Open Street Cat — это карта бездомных котов.
            <br />
            Здесь мы можем найти, помочь и сделать
            <br />
            город добрее.
          </p>
          <OscButton variant="primary" size="large" to="/map">
            <Map></Map>
            Смотреть карту
          </OscButton>
        </div>

        <div className={styles['hero-illustration']}></div>
      </section>

      <section
        className={`${styles['content-section']} osc-my-3 ${
          selectedCat ? styles['content-section--selected'] : ''
        }`}
      >
        <div className={styles['map-column']}>
          <TextInput
            prefix={<SearchIcon />}
            placeholder="Поиск по адресу, району или имени кота..."
            className="osc-mb-3"
          />

          <div className={styles['map-container']}>
            <MapWidget>
              <GeolocationController />
              <CatsLayer onSelect={setSelected} />
            </MapWidget>
          </div>
        </div>

        {selectedCat && <CatCard cat={selectedCat} />}

        <div className={styles['observations-column']} style={{ heigth: '100%' }}>
          <LastObservation />
        </div>
      </section>

      <section className={`${styles['additional-section']}`}>
        <LastFinded></LastFinded>
        <Stats></Stats>
      </section>
    </div>
  )
}
export default MainPage
