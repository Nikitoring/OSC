import OpenStreetCatLogo from '@/shared/assests/logo/black-logo.svg?react'
import styles from './authPage.module.css'

const AuthAside = () => {
  return (
    <aside className={styles.aside}>
      <OpenStreetCatLogo className="osc-ma-4" />
    </aside>
  )
}

export default AuthAside
