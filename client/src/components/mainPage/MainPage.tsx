import styles from './mainPage.module.css'
import { Map, SearchIcon } from 'lucide-react'
import OscButton from '@/components/shared/ui/buttons/Button'
import MapWidget from '../shared/mapWidget/MapWidget'
import { TextInput } from '@/components/shared/ui/textInput/TextInput'
import CatCard from '../cats/CatCard'
import LastObservation from './LastObservation'
import LastFinded from './LastFinded'
import Stats from './Statistics'

const MainPage = () => {
  const activeCat = {
    id: 1,
    name: 'Рыжик',
    gender: 'unknown',
    photos: [],
    location: [],
    help: [{ type: 'food', state: 'needed', createdAt: new Date() }],
    description: 'Славный, добрый рыжий кот. Подойдет и штанины оботрет)',
    createdAt: '',
    createdBy: 1,
  }

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
            <MapWidget></MapWidget>
          </div>
        </div>

        <CatCard cat={activeCat}></CatCard>
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
