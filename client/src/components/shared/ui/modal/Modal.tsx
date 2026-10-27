import { useEffect, type ReactNode } from 'react'
import './modal.css'
import OscButton from '@/components/shared/ui/buttons/Button'
import { X } from 'lucide-react'

type OscModalProps = {
  isShow: boolean
  title: string
  children: ReactNode
  actions?: ReactNode
  onClose: () => void
}

const OscModal = ({ isShow = false, title, children, actions, onClose }: OscModalProps) => {
  useEffect(() => {
    if (!isShow) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isShow, onClose])

  if (!isShow) return null

  return (
    <div className="osc-modal-wrapper">
      <main className="osc-modal show-modal" onClick={onClose}>
        <div className="osc-modal-content" onClick={(event) => event.stopPropagation()}>
          <div className="osc-modal-header">
            <span className="osc-text-xl">{title}</span>

            <OscButton
              variant="transparent"
              onClick={onClose}
              aria-label="Закрыть модальное окно"
              size="small"
              className="osc-px-0"
            >
              <X />
            </OscButton>
          </div>

          <div className="osc-modal-information">{children}</div>

          {actions && <div className="osc-modal-actions">{actions}</div>}
        </div>
      </main>
    </div>
  )
}

export default OscModal
