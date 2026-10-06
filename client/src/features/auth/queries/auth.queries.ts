import { useMutation } from '@tanstack/react-query'
import { loginUser, registerUser } from '../api/authApi'

type LoginUserResponse = {
  token: string
  username: string
}

/**
 * Query keys
 */
export const authQueryKeys = {
  all: ['auth'] as const,
  login: () => [...authQueryKeys.all, 'login'] as const,
  register: () => [...authQueryKeys.all, 'register'] as const,
  details: () => [...authQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...authQueryKeys.details(), id] as const,
  me: () => [...authQueryKeys.all, 'me'] as const,
}

/**
 * POST /auth/login
 */
export function useLoginUser() {
  return useMutation<LoginUserResponse, Error, { login: string; password: string }>({
    mutationKey: authQueryKeys.login(),
    mutationFn: ({ login, password }) => loginUser(login, password),
  })
}

/**
 * POST /auth/register
 */
export function useRegisterUser() {
  return useMutation<{ message: string }, Error, { login: string; password: string }>({
    mutationKey: authQueryKeys.register(),
    mutationFn: ({ login, password }) => registerUser(login, password),
  })
}
