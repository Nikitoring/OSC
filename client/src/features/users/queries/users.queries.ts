import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getMe, getUser } from '../api/users.api'
import type { User } from '@/domains/domains'

export type AuthUser = {
  id: string
  username: string
}

/**
 * Query keys
 */
export const usersQueryKeys = {
  all: ['users'] as const,
  details: () => [...usersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersQueryKeys.details(), id] as const,
  me: () => [...usersQueryKeys.all, 'me'] as const,
}

/**
 * GET /users/me
 */
export function useGetMe() {
  const { data, isLoading, isError } = useQuery<AuthUser>({
    queryKey: usersQueryKeys.me(),
    queryFn: () => getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000, // Кэшируем на 5 минут
    // Если нужно, чтобы сессия обновлялась при фокусе вкладки:
    refetchOnWindowFocus: true,
  })
  return {
    user: data ?? null,
    isLoading,
    isAuthenticated: !!data && !isError,
  }
}

/**
 * GET /users/:id
 */

export function useUser(id: string, options?: UseQueryOptions) {
  return useQuery<User>({
    queryKey: usersQueryKeys.detail(id as string),
    queryFn: () => getUser(id as string),
    enabled: !!id,
    ...options, // Передача ваших опций сверху
  })
}
