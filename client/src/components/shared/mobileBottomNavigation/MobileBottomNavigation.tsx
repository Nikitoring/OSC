import { NavLink } from 'react-router-dom'
import { Map, Cat, Plus, MessageCircleMore, UserRound } from 'lucide-react'

import styles from './mobileBottomNavigation.module.css'

type MobileBottomNavigationProps = {
  isAuthenticated: boolean
}

export function MobileBottomNavigation({ isAuthenticated }: MobileBottomNavigationProps) {
  if (isAuthenticated) {
    return (
      <nav className={styles.navigation} aria-label="Мобильная навигация">
        <NavLink to="/map" className={styles.item}>
          <Map />
          <span>Карта</span>
        </NavLink>

        <NavLink to="/cats" className={styles.item}>
          <Cat />
          <span>Коты</span>
        </NavLink>

        <NavLink to="/add-cat" className={styles.addButton} aria-label="Добавить кота">
          <Plus />
        </NavLink>

        <NavLink to="/my-observation" className={styles.item}>
          <MessageCircleMore />
          <span>Наблюдения</span>
        </NavLink>

        <NavLink to="/personal" className={styles.item}>
          <UserRound />
          <span>Профиль</span>
        </NavLink>
      </nav>
    )
  }

  return (
    <nav className={styles.navigation} aria-label="Мобильная навигация">
      <NavLink to="/cats" className={styles.item}>
        <Cat />
        <span>Коты</span>
      </NavLink>

      <NavLink to="/map" className={styles.item}>
        <Map />
        <span>Карта</span>
      </NavLink>

      <NavLink to="/login" className={styles.item}>
        <UserRound />
        <span>Профиль</span>
      </NavLink>
    </nav>
  )
}
