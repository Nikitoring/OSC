import { httpClient } from '@/shared/api/httpClient'

export type UserProfileActivity = {
  eventType: 'cat_created' | 'help_created'
  id: number | string
  catId: number | string
  catName: string
  helpType: 'food' | 'medical' | 'home' | null
  status: 'needed' | 'resolved' | null
  createdAt: string
}

export type UserProfile = {
  userId: number | string
  username: string
  createdAt: string | null
  stats: {
    catsAdded: number
    helpEvents: number
    resolvedHelpEvents: number
  }
  recentActivity: UserProfileActivity[]
}

export function getMe() {
  return httpClient<{ userId: string; username: string }>('/users/me')
}

export function getUser(id: string) {
  return httpClient<UserProfile>(`/users/${id}`)
}
