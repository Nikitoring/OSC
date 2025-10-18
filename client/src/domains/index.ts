export interface IFormElement {
  component: string
  id: string
  elementProps?: {
    color?: string
    label?: string
    placeholder?: string
    size?: string
    debounce?: string
    type?: string
    hint?: string
    rules?: string[]
    rows?: string
    filled?: boolean
    value: boolean | string | number | null
    options: string[] | { value: number | string; label: string }[]
  }
}

export interface ICat {
  id: number
  name: string
  description: string
  location: {
    latitude: number | null
    longitude: number | null
  }
  health_status: string
  is_sterilized: boolean
  is_friendly: boolean
  characteristics: string
  created_by: number
}

export interface ApproveAction {
  text: string
  action: (formData: Record<string, any>) => void
}

export interface ModalState {
  header: string
  form?: FormElement[]
  approve?: ApproveAction
}
