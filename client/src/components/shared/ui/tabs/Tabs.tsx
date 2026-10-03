import { useEffect, useRef, useState, type ReactNode } from 'react'
import './tabs.css'
type TabVariant = 'primary' | 'secondary'
type TabSize = 'small' | 'medium' | 'large'

type BaseProps = {
  children?: ReactNode
  variant?: TabVariant
  size?: TabSize
  full?: boolean
  className?: string
  items?: { label: string; id: string }[]
  onChange?: (id: string) => void
}

const OscTabs = ({
  children,
  variant = 'primary',
  size = 'medium',
  full = false,
  className = '',
  items = [],
  onChange,
  ...props
}: BaseProps) => {
  const classes = [
    'osc-tabs',
    `osc-tabs-${variant}`,
    size !== 'medium' && `osc-tabs-${size}`,
    full && 'osc-tabs-full',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const [isActive, setIsActive] = useState<string | null>(null)
  const initializedRef = useRef(false)
  const onClick = (sectionId: string) => {
    setIsActive(sectionId)
    if (onChange) {
      onChange(sectionId)
    }
  }
  useEffect(() => {
    if (items.length > 0 && !initializedRef.current) {
      setIsActive(items[0].id)
      initializedRef.current = true
    }
  }, [items])
  return (
    <div {...props} className={classes}>
      {items.map((item) => (
        <button
          key={item.id}
          className={`osc-tab ${isActive === item.id ? 'is-active' : ''}`}
          onClick={onClick.bind(null, item.id)}
        >
          {item.label}
        </button>
      ))}
      {children}
    </div>
  )
}

export default OscTabs
