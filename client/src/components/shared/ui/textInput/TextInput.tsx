import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import './input.css'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: ReactNode
  suffix?: ReactNode
  label?: string
  error?: string
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ prefix, suffix, label, error, className = '', disabled, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={`input-group ${className}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className={`input-wrapper ${disabled ? 'input-wrapper--disabled' : ''}`}>
          {prefix && <div className="input-prefix">{prefix}</div>}
          <input ref={ref} id={inputId} className="input" disabled={disabled} {...props} />
          {suffix && <div className="input-suffix">{suffix}</div>}
        </div>
        {error && <div className="input-error">{error}</div>}
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'
