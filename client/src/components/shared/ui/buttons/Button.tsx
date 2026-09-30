import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

import './button.css'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'small' | 'medium' | 'large'

type BaseProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
  className?: string
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
    <button {...props} className={classes}>
      {children}
    </button>
  )
}

export default OscButton
