import { Link } from 'react-router-dom'
import userState from '@/stores/userStore/userState'
import styles from './header.module.css'

import OscButton from '../ui/buttons/Button'

const LoginLogoutBtn = () => {
  const user = userState((s) => s.user)
  const isLoggedIn = !!user?.userId
  const btnProps = isLoggedIn ? { label: 'Выйти', to: '/logout' } : { label: 'Войти', to: '/login' }

  return (
    <OscButton variant="primary" size="small" {...btnProps}>
      {btnProps.label}
    </OscButton>
  )
}

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <Link to="/about" className={styles.link}>
          О проекте
        </Link>

        <LoginLogoutBtn></LoginLogoutBtn>
      </nav>
    </header>
  )
}

export default Header
