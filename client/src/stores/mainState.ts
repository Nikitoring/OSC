import { create } from 'zustand'

type Breadcrumbs = { title: string; to?: string }[]

type MainState = {
  breadcrumbs: Breadcrumbs
  setBreadcrumbs: (payload: Breadcrumbs) => void
}

const mainState = create<MainState>((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (payload: Breadcrumbs) => {
    set(() => ({
      breadcrumbs: payload,
    }))
  },
}))

export default mainState
