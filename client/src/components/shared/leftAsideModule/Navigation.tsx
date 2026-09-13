import { Bell, Cat, Map, Plus, UserRound } from 'lucide-react'

import './navigation.css'

const items = [
  {
    label: 'Карта',
    icon: Map,
    href: '/',
  },
  {
    label: 'Коты',
    icon: Cat,
    href: '/cats',
  },
  {
    label: 'Мои наблюдения',
    icon: Plus,
    href: '/observations',
  },
  {
    label: 'Уведомления',
    icon: Bell,
    href: '/notifications',
    badge: 3,
  },
  {
    label: 'Профиль',
    icon: UserRound,
    href: '/profile',
  },
]

const Navigation = () => {
  return (
    <nav className="navigation" aria-label="Основная навигация">
      <ul className="navigation__list">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.href} className="navigation__item">
              <a
                href={item.href}
                className={`navigation__link ${
                  item.href === '/' ? 'navigation__link--active' : ''
                }`}
              >
                <Icon className="navigation__icon" size={21} strokeWidth={2} />

                <span className="navigation__label">{item.label}</span>

                {item.badge && <span className="navigation__badge">{item.badge}</span>}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navigation
