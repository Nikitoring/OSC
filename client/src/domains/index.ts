export interface FormElement {
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
  }
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
