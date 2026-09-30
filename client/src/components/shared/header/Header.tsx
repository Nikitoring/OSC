import styles from './header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <a href="/map" className={styles.link}>
          Карта
        </a>

        <a href="/about" className={styles.link}>
          О проекте
        </a>

        <a href="/login" className={styles.login}>
          Войти
        </a>
      </nav>
    </header>
  )
}

export default Header
