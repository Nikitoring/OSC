import { ApiError } from './apiError'

const API_URL = import.meta.env.VITE_API_BASE_URL

type RequestOptions = RequestInit & {
  token?: string
}

export async function httpClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...requestOptions } = options

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...requestOptions.headers,
    },
  })

  if (!response.ok) {
    const data = await response.json()
    throw new ApiError(response.status, data.error)
  }

  return response.json() as Promise<T>
}
