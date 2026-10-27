import { useState } from 'react'
import OscSelect from '../ui/select/OSCSelect'

const HelpRequestForm = ({ onChange }: { onChange: (type: string) => void }) => {
  const [helpType, setHelpType] = useState('')
  const menuItems = [
    { label: '🍗 Необходима еда', value: 'food' },
    { label: '🏥 Нужен врач', value: 'medical' },
    { label: '🏠 Необходим дом', value: 'home' },
  ]

  const handleSelect = (value: string) => {
    setHelpType(value)
    onChange(value)
  }
  return (
    <div className="osc-mb-3">
      <OscSelect
        label="Выберите тип помощи"
        name="helpType"
        options={menuItems}
        value={helpType}
        onChange={handleSelect}
        placeholder="Выберите"
      />
    </div>
  )
}

export default HelpRequestForm
