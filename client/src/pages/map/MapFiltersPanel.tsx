import styles from './mapPage.module.css'
import { TextInput } from '@/components/shared/ui/textInput/TextInput'
import { SearchIcon } from 'lucide-react'
import { debounce } from '@/utils/debounce'
import HelpRequestForm from '@/components/shared/helpRequestForm/HelpRequestForm'

type Props = {
  filters: { search_text?: string; gender?: string }
  onFiltersChange: (filters: {
    search_text?: string
    gender?: string
    help_type?: ('food' | 'medical' | 'home')[]
  }) => void
}
export function MapFiltersPanel({ filters, onFiltersChange }: Props) {
  const handleInputChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onFiltersChange({ ...filters, [name]: value })
  }, 500)

  const handleSelect = (value: 'food' | 'medical' | 'home') => {
    onFiltersChange({ ...filters, help_type: [value] })
  }

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
      />

      <HelpRequestForm onChange={handleSelect} isHideLable />
    </div>
  )
}
