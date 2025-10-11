import { ref } from 'vue'
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

  const register = async (email: string, password: string, fullName = '') => {
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) throw new Error(authError.message)
    return data
  }

  const login = async (email: string, password: string) => {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
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

  return {
    user,
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
