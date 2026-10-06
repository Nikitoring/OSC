import type { User } from '@/domains/domains'
import { getMe } from '@/features/users/api/users.api'

import { create } from 'zustand'

type UserState = {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  setUser: (payload: User) => void
  getUser: () => Promise<void>
}

const userState = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  setUser: (payload: User) => {
    set(() => ({
      user: payload,
    }))
  },
  getUser: async () => {
    set({ isLoading: true })
    try {
      const result = await getMe()
      if (result) {
        set({ user: result as User, isInitialized: true })
      } else {
        // Когда не авторизован
        set({ user: null, isInitialized: true })
      }
    } catch (error) {
      // Если токен невалиден (401) или сервер упал
      set({ user: null, isInitialized: true })
    } finally {
      set({ isLoading: false })
    }
  },
}))

export default userState
