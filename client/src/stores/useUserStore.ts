import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import { useQuasar } from 'quasar'
import { useAuth } from '@/composables/useAuth'

export const useUserStore = defineStore('userStore', () => {
  const $q = useQuasar()
  const { login: authLogin, authState, register: authRegister } = useAuth()

  const user = computed(() => authState.value.user)
  const isAuthenticated = computed(() => authState.value.isAuthenticated)
  const isLoading = computed(() => authState.value.isLoading)
  const access_token = ref(null)
  const userInfo = computed(() => user.value?.user_metadata)

  const register = async (payload: { email: string; password: string; username: string }) => {
    if (!payload.email || !payload.password || !payload.username) return

    await authRegister(payload)
  }

  const login = async (payload: { email: string; password: string }) => {
    if (!payload.email || !payload.password) return false
    return await authLogin(payload)
  }

  // const logout = async () => {
  //   // const { error: authError } = await supabase.auth.signOut()
  //   // if (authError) throw new Error(authError.message)
  // }

  // const resetPassword = async (email) => {
  //   const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
  //     redirectTo: `${window.location.origin}/reset-password`,
  //   })

  //   if (authError) throw new Error(authError.message)
  // }

  // const updateProfile = async (updates) => {
  //   const { error: authError } = await supabase.auth.updateUser(updates)
  //   if (authError) throw new Error(authError.message)
  // }

  return {
    user,
    userInfo,
    isLoading,
    register,
    login,
    isAuthenticated,
    // logout,
    // resetPassword,
    // updateProfile,
  }
})
