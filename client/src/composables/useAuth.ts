import { useQuasar } from 'quasar'
import { config } from '../../config'
import { ref } from 'vue'
import { useApi } from './useApi'

interface AuthState {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const { request } = useApi()
  const $q = useQuasar()

  const authState = ref<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })
  // Инициализация авторизации при загрузке приложения
  const initializeAuth = async (): Promise<boolean> => {
    authState.value.isLoading = true
    try {
      const accessToken = $q.localStorage.getItem('auth_token') as string
      const refreshToken = $q.localStorage.getItem('refresh_token') as string
      const expiresAt = $q.localStorage.getItem('token_expires_at') as number

      // Если нет токенов - пользователь не авторизован
      if (!accessToken || !refreshToken) {
        authState.value.isLoading = false
        return false
      }

      // Проверяем срок действия access token
      const isExpired = !expiresAt || Date.now() >= expiresAt
      if (isExpired) {
        // Пробуем тихую авторизацию
        return await silentRefresh(refreshToken)
      } else {
        // Токен валиден, получаем данные пользователя
        const { response, data } = await request('/api/auth/init', {}, { silent: true })
        if (response?.ok) {
          authState.value.user = data.user
          authState.value.isAuthenticated = true
          authState.value.isLoading = false
          return true
        } else {
          // Если init не удался, пробуем refresh
          return await silentRefresh(refreshToken)
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      await clearAuthData()
      authState.value.isLoading = false
      return false
    }
  }

  // Тихая авторизация (обновление токена)
  const silentRefresh = async (refreshToken: string): Promise<boolean> => {
    try {
      authState.value.isLoading = true
      const { response, data } = await request(
        '/api/auth/silent-refresh',
        {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
        { silent: true },
      )

      if (response && response.ok) {
        await setAuthData(data.access_token, data.refresh_token, data.expires_at, data.user)

        authState.value.user = data.user
        authState.value.isAuthenticated = true
        authState.value.isLoading = false
        return true
      }
    } catch (error) {
      console.error('Silent refresh failed:', error)
    }

    // Если refresh не удался - разлогиниваем
    await clearAuthData()
    authState.value.isLoading = false
    return false
  } // Сохранение данных авторизации
  const setAuthData = async (
    accessToken: string,
    refreshToken: string,
    expiresAt: string,
    userData: any,
  ): Promise<void> => {
    $q.localStorage.setItem('auth_token', accessToken)
    $q.localStorage.setItem('refresh_token', refreshToken)
    $q.localStorage.setItem('token_expires_at', expiresAt)

    // Сохраняем базовые данные пользователя
    $q.localStorage.setItem('user_data', JSON.stringify(userData))
  }

  // Очистка данных авторизации
  const clearAuthData = async (): Promise<void> => {
    $q.localStorage.remove('auth_token')
    $q.localStorage.remove('refresh_token')
    $q.localStorage.remove('token_expires_at')
    $q.localStorage.remove('user_data')
  }
  // Проверка срока действия токена
  const isTokenExpired = (): boolean => {
    const expiresAt = $q.localStorage.getItem('token_expires_at') as number
    return !expiresAt || Date.now() >= expiresAt
  }

  // Получение оставшегося времени жизни токена
  const getTokenTimeLeft = (): number => {
    const expiresAt = $q.localStorage.getItem('token_expires_at') as number
    if (!expiresAt) return 0
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 60000)) // в минутах
  }
  const startTokenMonitor = () => {
    // Проверяем каждые 5 минут
    return setInterval(
      () => {
        const timeLeft = getTokenTimeLeft()

        // Если до истечения токена меньше 15 минут - обновляем
        if (timeLeft > 0 && timeLeft < 15) {
          const refreshToken = $q.localStorage.getItem('refresh_token') as string
          if (refreshToken) {
            silentRefresh(refreshToken).catch(console.error)
          }
        }
      },
      5 * 60 * 1000,
    ) // 5 минут
  }
  const login = async (payload: { email: string; password: string }) => {
    try {
      const { response, data } = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (response && response.ok) {
        await setAuthData(data.access_token, data.refresh_token, data.expires_at, data.user)

        authState.value.user = data.user
        authState.value.isAuthenticated = true

        $q.notify({
          type: 'positive',
          message: 'Успешный вход!',
          timeout: 2000,
        })

        return true
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
    return false
  }

  const register = async (payload: { email: string; password: string; username: string }) => {
    try {
      const { response } = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (response && response.ok) {
        $q.notify({
          type: 'positive',
          message: 'Регистрация успешна! Теперь вы можете войти.',
          timeout: 3000,
        })
        return true
      }
    } catch (error) {
      console.error('Register error:', error)
      return false
    }

    return false
  }

  const logout = async (): Promise<void> => {
    try {
      const accessToken = $q.localStorage.getItem('auth_token') as string

      if (accessToken) {
        await request('/api/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ access_token: accessToken }),
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      await clearAuthData()
      authState.value.user = null
      authState.value.isAuthenticated = false
    }
  }
  const getProfile = () => request('/api/auth/profile')
  return {
    initializeAuth,
    startTokenMonitor,
    silentRefresh,
    login,
    register,
    logout,
    getProfile,
    authState,
  }
}
