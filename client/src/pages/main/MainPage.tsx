import styles from './mainPage.module.css'
import { Map, SearchIcon } from 'lucide-react'
import OscButton from '@/components/shared/ui/buttons/Button'
import { MapWidget } from '../../components/shared/mapWidget/MapWidget'
import { TextInput } from '@/components/shared/ui/textInput/TextInput'
import { GeolocationController } from '@/features/geolocation/geolocationController'
import CatCard from '../../features/cats/ui/catCard/CatCard'
import LastObservation from '../../components/mainPage/LastObservation'
import LastFinded from '../../components/mainPage/LastFinded'
import Stats from '../../components/mainPage/Statistics'
import { useState } from 'react'
import type { Cat } from '@/domains/domains'
import { CatsLayer } from '@/features/cats/ui/catLayer/catLayer'

const MainPage = () => {
  const [selectedCat, setSelectedId] = useState<Cat | null>(null)

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

      <section className={`${styles['content-section']} osc-my-3`}>
        <div>
          <TextInput
            prefix={<SearchIcon />}
            placeholder="Поиск по адресу, району или имени кота..."
            className="osc-mb-3"
          ></TextInput>
          <div className={`${styles['map-container']}`}>
            <MapWidget>
              <GeolocationController />
              <CatsLayer onSelect={setSelectedId} />
            </MapWidget>
          </div>
        </div>

        {selectedCat && <CatCard cat={selectedCat}></CatCard>}
        <LastObservation></LastObservation>
      </section>
      <section className={`${styles['additional-section']}`}>
        <LastFinded></LastFinded>
        <Stats></Stats>
      </section>
    </div>
  )
}
export default MainPage
