import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react'
import './input.css'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: ReactNode
  suffix?: ReactNode
  label?: ReactNode
  error?: string
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      prefix,
      suffix,
      label,
      error,
      className = '',
      disabled,
      id,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId
    const hasError = Boolean(error || ariaInvalid)

    return (
      <div className={`input-group ${className}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div
          className={`input-wrapper ${disabled ? 'input-wrapper--disabled' : ''} ${hasError ? 'input-wrapper--error' : ''}`}
        >
          {prefix && <div className="input-prefix">{prefix}</div>}
          <input
            ref={ref}
            id={inputId}
            className="input"
            disabled={disabled}
            aria-invalid={hasError || undefined}
            {...props}
          />
          {suffix && <div className="input-suffix">{suffix}</div>}
        </div>
        {error && <div className="input-error" role="alert">{error}</div>}
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'
