import type { HelpRequest, Cat, CatId, HelpType, HelpState } from '../../../domains/domains'
import { httpClient } from '@/shared/api/httpClient'

/**
 * Параметры запроса для типа помощи.
 */
export type GetHelpParams = {
  page?: number
  limit?: number
  type?: 'food' | 'medical' | 'home'
  status?: 'needed' | 'resolved'
}

export interface HelpRequestDto {
  id: number
  catId: number
  type: HelpType
  state: HelpState
  createdAt: string
  createdBy: number
}

export interface GetCatHelpResponseDto {
  catId: number
  isActive: boolean
  current: HelpRequestDto[]
  history: HelpRequestDto[]
}

export interface CreateHelpRequestDto {
  catId: number
  type: HelpType
}

export function getLastHelpRequests(limit = 5) {
  return httpClient<(HelpRequest & Cat)[]>(`/help/last?limit=${limit}`)
}

export function getHelpRequestByCat(catId: CatId) {
  return httpClient<GetCatHelpResponseDto>(`/help/${catId}`)
}

export function createHelpRequest(catId: CatId, data: CreateHelpRequestDto) {
  return httpClient<HelpRequestDto>(`/help/${catId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}
