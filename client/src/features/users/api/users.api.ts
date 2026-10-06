import { httpClient } from '@/shared/api/httpClient'

export function getMe() {
  return httpClient('/users/me')
}
