import { httpClient } from '@/shared/api/httpClient'

type AuthResponse = {
  user: {
    id: number
    username: string
  }
}

export function loginUser(login: string, password: string) {
  return httpClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  })
}

export function registerUser(login: string, password: string) {
  return httpClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  })
}
