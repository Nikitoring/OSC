import { Cat, Map, Plus, UserRound, type LucideIcon } from 'lucide-react'
import './navigation.css'
import userState from '@/stores/userStore/userState'
import { NavLink } from 'react-router-dom'

type NavItem = {
  id: string
  defaultLabel: string
  icon: LucideIcon
  href: string
  badge?: string | number
}

const mainItems: NavItem[] = [
  { id: 'map', defaultLabel: 'Карта', icon: Map, href: '/map' },
  { id: 'cats', defaultLabel: 'Коты', icon: Cat, href: '/cats' },
  { id: 'my_requests', defaultLabel: 'Мои наблюдения', icon: Plus, href: '/observations' },
  { id: 'profile', defaultLabel: 'Профиль', icon: UserRound, href: '/profile' },
]

const Navigation = () => {
  const username = userState((s) => s.user?.username)

  const items = mainItems.map((item) => ({
    ...item,
    label: item.id === 'profile' && username ? username : item.defaultLabel,
  }))

  return (
    <nav className="navigation" aria-label="Основная навигация">
      <ul className="navigation__list">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.id} className="navigation__item">
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `navigation__link ${isActive ? 'navigation__link--active' : ''}`
                }
              >
                <Icon className="navigation__icon" size={21} strokeWidth={2} />
                <span className="navigation__label">{item.label}</span>
                {item.badge && <span className="navigation__badge">{item.badge}</span>}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navigation
