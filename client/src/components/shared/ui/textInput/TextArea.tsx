import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from 'react'
import './textarea.css'

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode
  error?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', id, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className={`osc-textarea-group ${className}`}>
        {label && <label className="osc-textarea-label" htmlFor={inputId}>{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          className="osc-textarea"
          aria-invalid={error ? true : ariaInvalid}
          {...props}
        />
        {error && <div className="osc-textarea-error" role="alert">{error}</div>}
      </div>
    )
  },
)

TextArea.displayName = 'TextArea'
