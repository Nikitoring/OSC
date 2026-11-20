import { useEffect } from 'react'
import { CircleCheck, CircleX, X } from 'lucide-react'
import './oscNotice.css'

export type OscNoticeType = 'success' | 'error'

type OscNoticeProps = {
  type: OscNoticeType
  message: string
  duration?: number
  onClose: () => void
}

const OscNotice = ({ type, message, duration = 5000, onClose }: OscNoticeProps) => {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timeoutId)
  }, [duration, onClose])

  const Icon = type === 'success' ? CircleCheck : CircleX

  return (
    <div className={`osc-notice osc-notice--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <Icon size={21} aria-hidden="true" />
      <span className="osc-notice__message">{message}</span>
      <button className="osc-notice__close" type="button" onClick={onClose} aria-label="Закрыть">
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  )
}

export default OscNotice
