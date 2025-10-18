import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { config } from '../../config'

export function useApi() {
  const { api } = config()
  const $q = useQuasar()
  const loading = ref(false)
  const request = async (
    endpoint: string,
    options: RequestInit = {},
    config: { silent?: boolean } = {},
  ) => {
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
      // Если получили 401 и это не запрос на обновление токена - пробуем refresh
      if (
        response.status === 401 &&
        !endpoint.includes('/auth/silent-refresh') &&
        !endpoint.includes('/auth/logout') &&
        options.retry !== false
      ) {
        const refreshToken = $q.localStorage.getItem('refresh_token') as string
        if (refreshToken) {
          const responseRefresh = await request(
            '/api/auth/silent-refresh',
            {
              method: 'POST',
              body: JSON.stringify({ refresh_token: refreshToken }),
            },
            { silent: true },
          )

          if (responseRefresh.success) {
            $q.localStorage.set('auth_token', responseRefresh.access_token)
            $q.localStorage.set('refresh_token', responseRefresh.refresh_token)
            // Сохраняем время истечения токена (примерно 1 час)
            const expiresAt = Date.now() + 60 * 60 * 1000 // 1 час
            $q.localStorage.set('token_expires_at', expiresAt)

            // Сохраняем базовые данные пользователя
            $q.localStorage.set('user_data', JSON.stringify(responseRefresh.user))
            // Повторяем оригинальный запрос с новым токеном
            const newToken = $q.localStorage.getItem('auth_token') as string
            headers.Authorization = `Bearer ${newToken}`

            const retryResponse = await fetch(`${api}${endpoint}`, {
              ...options,
              headers,
            })

            if (!retryResponse.ok) {
              throw new Error(`HTTP error! status: ${retryResponse.status}`)
            }

            const result = await retryResponse.json()
            loading.value = false
            return result
          }

          if (!responseRefresh.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Ошибка сервера')
          }
        }
      }
      return { response: response, data: await response.json() }
    } catch (error: any) {
      if (!config.silent) {
        $q.notify({
          type: 'negative',
          message: error.message || 'Произошла ошибка',
        })
      }
      return { error }
    } finally {
      loading.value = false
    }
  }

  // Cats methods
  const cats = {
    getAll: (params?: any) => {
      const query = new URLSearchParams(params).toString()
      return request(`/api/cats?${query}`)
    },

    getById: (id: string) => request(`/api/cats/${id}`),

    create: (catData: FormData) => {
      request('/api/cats', {
        method: 'POST',
        body: catData,
        headers: {
          'Content-Type': 'application/json',
        }, // FormData сам установит Content-Type
      })
    },

    update: (id: string, catData: FormData) =>
      request(`/api/cats/${id}`, {
        method: 'PUT',
        body: catData,
        headers: {},
      }),

    delete: (id: string) => request(`/api/cats/${id}`, { method: 'DELETE' }),
  }

  return {
    loading,
    cats,
    request,
  }
}
