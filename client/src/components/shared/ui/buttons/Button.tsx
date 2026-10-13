import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

import './button.css'

type ButtonVariant = 'primary' | 'secondary' | 'transparent' | 'tertiary'
type ButtonSize = 'small' | 'medium' | 'large' | 'xs'

type BaseProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
  className?: string
  onClick?: () => void
}

type ButtonElementProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
    to?: never
  }

type ButtonLinkProps = BaseProps &
  LinkProps & {
    to: string
    href?: never
  }

type ButtonAnchorProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    to?: never
  }

export type ButtonProps = ButtonElementProps | ButtonLinkProps | ButtonAnchorProps

const OscButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  full = false,
  className = '',
  onClick,
  ...props
}: ButtonProps) => {
  const classes = [
    'osc-button',
    `osc-button-${variant}`,
    size !== 'medium' && `osc-button-${size}`,
    full && 'osc-button-full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const onInheritClick = () => {
    if (onClick) {
      onClick()
    }
  }
  if ('to' in props && props.to) {
    return (
      <Link {...props} className={classes}>
        {children}
      </Link>
    )
  }

  // Обычная ссылка
  if ('href' in props && props.href) {
    return (
      <a {...props} className={classes}>
        {children}
      </a>
    )
  }

  // Кнопка
  return (
    <button {...props} className={classes} onClick={onInheritClick.bind(null)}>
      {children}
    </button>
  )
}

export default OscButton
