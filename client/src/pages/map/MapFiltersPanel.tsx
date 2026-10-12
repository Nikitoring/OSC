import styles from './mapPage.module.css'
import { TextInput } from '@/components/shared/ui/textInput/TextInput'
import { SearchIcon, SlidersHorizontal } from 'lucide-react'
import { debounce } from '@/utils/debounce'
import OscDropdownMenu from '../../components/shared/ui/dropdownMenu/DropdownMenu'

type Props = {
  filters: { search_text?: string; gender?: string }
  onFiltersChange: (filters: { search_text?: string; gender?: string }) => void
}

export function MapFiltersPanel({ filters, onFiltersChange }: Props) {
  const handleInputChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onFiltersChange({ ...filters, [name]: value })
  }, 500)
  const menuItems = [
    { label: '🍗 Необходима еда', value: 'food' },
    { label: '🏥 Нужен врач', value: 'medical' },
    { label: '🏠 Необходим дом', value: 'home' },
  ]
  const handleSelect = (value: string) => {}

  return (
    <div className={styles['map-filters-panel']}>
      <TextInput
        label=""
        id="search"
        name="search_text"
        prefix={<SearchIcon />}
        placeholder="Поиск по имени кота"
        value={filters.search_text}
        onChange={handleInputChange}
        style={{ width: '300px' }}
      ></TextInput>
      <OscDropdownMenu variant="secondary" items={menuItems} onSelect={handleSelect}>
        <SlidersHorizontal></SlidersHorizontal>
        Помощь
      </OscDropdownMenu>
    </div>
  )
}
