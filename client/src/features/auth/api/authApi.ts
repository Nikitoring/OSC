import { httpClient } from '@/shared/api/httpClient'

export function loginUser(login: string, password: string) {
  return httpClient<{ token: string }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  })
}

export function registerUser(login: string, password: string) {
  return httpClient<{ message: string }>('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  })
}
