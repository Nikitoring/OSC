import { useEffect, useId, useRef, useState } from 'react'
import './select.css'

export type SelectOption = {
  label: string
  value: string
  disabled?: boolean
}

export type SelectProps = {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  name?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  className?: string
  menuClassName?: string
  optionClassName?: string
  id?: string
}

const OscSelect = ({
  options,
  value,
  defaultValue = '',
  onChange,
  name,
  label,
  placeholder = 'Выберите значение',
  disabled = false,
  required = false,
  error,
  className = '',
  menuClassName = '',
  optionClassName = '',
  id,
}: SelectProps) => {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = `${selectId}-listbox`
  const selectedValue = value ?? internalValue
  const selectedOption = options.find((option) => option.value === selectedValue)

  const closeMenu = () => setIsOpen(false)

  const handleSelect = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue)
    onChange?.(nextValue)
    closeMenu()
  }

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className={`osc-select ${className}`} ref={rootRef}>
      {label && (
        <label className="osc-select-label" htmlFor={selectId}>
          {label}
          {required && (
            <span className="osc-select-required" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}

      <button
        id={selectId}
        type="button"
        className={`osc-select-trigger ${isOpen ? 'osc-select-trigger-open' : ''} ${error ? 'osc-select-trigger-error' : ''}`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={label ? `${selectId}-label` : undefined}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        {label && (
          <span id={`${selectId}-label`} className="osc-select-visually-hidden">
            {label}
          </span>
        )}
        <span className={`osc-select-value ${!selectedOption ? 'osc-select-placeholder' : ''}`}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          className={`osc-select-icon ${isOpen ? 'osc-select-icon-open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
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
      </button>

      {name && <input type="hidden" name={name} value={selectedValue} />}
      {error && (
        <p className="osc-select-error" role="alert">
          {error}
        </p>
      )}

      {isOpen && (
        <ul
          id={listboxId}
          className={`osc-select-menu ${menuClassName}`}
          role="listbox"
          aria-label={label ?? placeholder}
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={`osc-select-option ${isSelected ? 'osc-select-option-selected' : ''} ${optionClassName}`}
                  disabled={option.disabled}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M3 8.5L6.2 11.5L13 4.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default OscSelect
