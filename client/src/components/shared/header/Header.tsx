import { Link } from 'react-router-dom'
import userState from '@/stores/userStore/userState'
import styles from './header.module.css'

import OscButton from '../ui/buttons/Button'
import mainState from '@/stores/mainState'

const LoginLogoutBtn = () => {
  const user = userState((s) => s.user)
  console.log('user', user)
  const isLoggedIn = !!user?.userId
  const btnProps = isLoggedIn ? { label: 'Выйти', to: '/logout' } : { label: 'Войти', to: '/login' }

  return (
    <OscButton variant="primary" size="small" {...btnProps}>
      {btnProps.label}
    </OscButton>
  )
}

const Header = () => {
  const breadcrumbs = mainState((s) => s.breadcrumbs)
  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumbs}>
        {breadcrumbs.map((crumb, index) => (
          <Link key={index} to={crumb.to || '#'}>
            {crumb.title}
          </Link>
        ))}
      </nav>
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
