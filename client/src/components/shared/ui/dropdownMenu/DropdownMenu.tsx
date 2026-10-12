import { useState, useRef, useEffect, ReactNode } from 'react'
import './dropdown-menu.css'
import OscButton, { type ButtonProps } from '../buttons/Button'

export type DropdownMenuItem = {
  label: string
  value: string
  disabled?: boolean
}

export type DropdownMenuProps = Omit<ButtonProps, 'onClick'> & {
  items: DropdownMenuItem[]
  onSelect?: (value: string) => void
  menuClassName?: string
  itemClassName?: string
  triggerIcon?: ReactNode
}

const OscDropdownMenu = ({
  items,
  onSelect,
  menuClassName = '',
  itemClassName = '',
  triggerIcon,
  children,
  className = '',
  ...buttonProps
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  const handleSelect = (value: string) => {
    onSelect?.(value)
    closeMenu()
  }

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Закрытие по нажатию Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Дефолтная иконка шеврона вниз
  const defaultIcon = (
    <svg
      className={`osc-dropdown-icon ${isOpen ? 'osc-dropdown-icon-open' : ''}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  return (
    <div className={`osc-dropdown ${className}`} ref={dropdownRef}>
      <OscButton {...buttonProps} onClick={toggleMenu} aria-haspopup="true" aria-expanded={isOpen}>
        {children}
        {triggerIcon !== undefined ? triggerIcon : defaultIcon}
      </OscButton>

      {isOpen && (
        <ul className={`osc-dropdown-menu ${menuClassName}`} role="menu">
          {items.map((item) => (
            <li key={item.value} role="none">
              <button
                type="button"
                className={`osc-dropdown-item ${itemClassName}`}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleSelect(item.value)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default OscDropdownMenu
