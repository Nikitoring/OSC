import type { User } from '@/domains/domains'
import { httpClient } from '@/shared/api/httpClient'

export function getMe() {
  return httpClient('/users/me')
}

export function getUser(id: string) {
  return httpClient<User>(`/users/${id}`)
}
