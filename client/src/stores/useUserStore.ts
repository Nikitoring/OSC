import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import { useQuasar } from 'quasar'

const $q = useQuasar()

export const useUserStore = defineStore('userStore', () => {
  const { auth } = useApi()

  const user = ref(null)
  const access_token = ref(null)
  const register = async (payload: { email: string; password: string; username: string }) => {
    if (!payload.email || !payload.password || !payload.username) return

    const { message, user: responseUser, error } = await auth.register(payload)
    if (message) {
      $q.notify({
        type: 'positive',
        message: message,
      })
    }
    user.value = responseUser
    if (error) throw new Error(error)
  }

  const login = async (payload: { email: string; password: string }) => {
    if (!payload.email || !payload.password) return
    const { message, access_token, user: responseUser, error } = await auth.login(payload)
    if (message) {
      $q.notify({
        type: 'positive',
        message: message,
      })
    }
    if (access_token) {
      $q.localStorage.set('auth_token', access_token)
    }
    user.value = responseUser

    if (error) throw new Error(error)
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

  const userInfo = computed(() => {
    return user.value && user.value.email ? user.value.user_metadata : {}
  })

  return {
    user,
    userInfo,
    register,
    login,
    // logout,
    // resetPassword,
    // updateProfile,
  }
})
