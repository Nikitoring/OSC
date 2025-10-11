import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../plugins/supabaseClient'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const initializeAuth = async () => {
    isLoading.value = true

    // Проверяем существующую сессию
    const {
      data: { session },
    } = await supabase.auth.getSession()
    user.value = session?.user ?? null

    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event)
      user.value = session?.user ?? null
      isLoading.value = false
    })

    isLoading.value = false
  }

  const clearError = () => {
    error.value = null
  }

  const register = async (payload: { email: string; password: string; fullName?: string }) => {
    if (!payload.email || !payload.password) return
    const body = {
      email: payload.email,
      password: payload.password,
    }
    if (payload.fullName) {
      body.options = {
        data: {
          full_name: payload.fullName,
        },
      }
    }
    const { data, error: authError } = await supabase.auth.signUp(body)

    if (authError) throw new Error(authError.message)
    return data
  }

  const login = async (payload: { email: string; password: string }) => {
    if (!payload.email || !payload.password) return
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      ...payload,
    })

    if (authError) throw new Error(authError.message)
    return data
  }

  const logout = async () => {
    const { error: authError } = await supabase.auth.signOut()
    if (authError) throw new Error(authError.message)
  }

  const resetPassword = async (email) => {
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (authError) throw new Error(authError.message)
  }

  const updateProfile = async (updates) => {
    const { error: authError } = await supabase.auth.updateUser(updates)
    if (authError) throw new Error(authError.message)
  }

  const userInfo = computed(() => {
    return user.value && user.value.email ? user.value.user_metadata : {}
  })

  return {
    user,
    userInfo,
    isLoading,
    error,
    initializeAuth,
    clearError,
    register,
    login,
    logout,
    resetPassword,
    updateProfile,
  }
})
