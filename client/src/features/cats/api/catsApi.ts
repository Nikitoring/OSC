import { httpClient } from '@/shared/api/httpClient'
import type { Cat, CatId, CreateCatDto } from '@/domains/domains'

/**
 * Параметры запроса списка котов.
 */
export type GetCatsParams = {
  page?: number
  limit?: number
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
  search_text?: string
  gender?: Array<'male' | 'female' | 'unknown'>
}

/**
 * Ответ GET /cats.
 */
export type GetCatsResponse = {
  cats: Cat[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

/**
 * Собирает query-string для GET /cats.
 *
 * - bounds сериализуется в JSON
 * - gender передаётся как repeated param: ?gender=male&gender=female
 */
function buildCatsQueryString(params: GetCatsParams = {}): string {
  const searchParams = new URLSearchParams()

  if (params.page !== undefined) searchParams.set('page', String(params.page))
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit))

  if (params.bounds) {
    searchParams.set('bounds', JSON.stringify(params.bounds))
  }

  if (params.gender?.length) {
    for (const g of params.gender) {
      searchParams.append('gender', g)
    }
  }
  if (params.search_text?.length) {
    searchParams.append('search_text', params.search_text)
  }

  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

/**
 * GET /cats
 */
export function getCats(params: GetCatsParams = {}) {
  return httpClient<GetCatsResponse>(`/cats${buildCatsQueryString(params)}`)
}

/**
 * GET /cats/:id
 */
export function getCat(id: CatId) {
  return httpClient<Cat>(`/cats/${id}`)
}

/**
 * POST /cats
 */
export function createCat(data: CreateCatDto) {
  return httpClient<Cat>('/cats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function getLastCats(limit = 5) {
  return httpClient<Cat[]>(`/cats/last?limit=${limit}`)
}

export function getCatsStats() {
  return httpClient<GetCatsResponse>(`/cats/stats`)
}
