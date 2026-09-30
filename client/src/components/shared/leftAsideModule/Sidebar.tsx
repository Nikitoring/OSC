import OpenStreetCatLogo from '@/shared/assests/logo/open-street-cat-logo.svg?react'
import Navigation from './Navigation'
import styles from './sidebar.module.css'

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <OpenStreetCatLogo className="osc-ma-4" />
      <Navigation></Navigation>
      <div className={styles.footer}>
        <div className={styles['footer-image']}></div>

        <p>
          Больше доброты
          <br />
          на улицах города
        </p>

        <div className={styles['orange-line']} />
      </div>
    </aside>
  )
}

export default Sidebar
