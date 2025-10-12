import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { config } from '../../config'

export function useApi() {
  const { api } = config()
  const $q = useQuasar()
  const loading = ref(false)

  const request = async (endpoint: string, options: RequestInit = {}) => {
    loading.value = true

    try {
      const token = $q.localStorage.getItem('auth_token')
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }

      const response = await fetch(`${api}${endpoint}`, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Ошибка сервера')
      }

      return await response.json()
    } catch (error: any) {
      $q.notify({
        type: 'negative',
        message: error.message || 'Произошла ошибка',
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  // Auth methods
  const auth = {
    login: (payload: { email: string; password: string }) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    register: (payload: { email: string; password: string; username: string }) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    getProfile: () => request('/auth/profile'),
  }

  // Cats methods
  const cats = {
    getAll: (params?: any) => {
      const query = new URLSearchParams(params).toString()
      return request(`/cats?${query}`)
    },

    getById: (id: string) => request(`/cats/${id}`),

    create: (catData: FormData) =>
      request('/cats', {
        method: 'POST',
        body: catData,
        headers: {}, // FormData сам установит Content-Type
      }),

    update: (id: string, catData: FormData) =>
      request(`/cats/${id}`, {
        method: 'PUT',
        body: catData,
        headers: {},
      }),

    delete: (id: string) => request(`/cats/${id}`, { method: 'DELETE' }),
  }

  return {
    loading,
    auth,
    cats,
  }
}
