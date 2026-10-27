import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Cat, CatId } from '../../../domains/domains'
import {
  getLastHelpRequests,
  getHelpRequestByCat,
  createHelpRequest,
  type GetHelpParams,
  type GetCatHelpResponseDto,
  type HelpRequestDto,
  type CreateHelpRequestDto,
} from '../api/helpApi'

/**
 * Query keys
 */
export const helpRequestQueryKeys = {
  all: ['help'] as const,
  lists: () => [...helpRequestQueryKeys.all, 'list'] as const,
  list: (params: GetHelpParams) => [...helpRequestQueryKeys.lists(), params] as const,
  details: () => [...helpRequestQueryKeys.all, 'detail'] as const,
  detail: (id: CatId) => [...helpRequestQueryKeys.details(), id] as const,
  byCatId: (catId: CatId) => [...helpRequestQueryKeys.all, 'cat', catId] as const,
  last: (limit: number) => [...helpRequestQueryKeys.all, 'last', limit] as const,
}

/**
 * Получение последних полученных событий.
 * GET /help/last?limit=5
 */
export function useLastHelp(limit = 5) {
  return useQuery<(HelpRequestDto & Cat)[]>({
    queryKey: helpRequestQueryKeys.last(limit),
    queryFn: () => getLastHelpRequests(limit),
    placeholderData: (prev) => prev,
  })
}

/**
 * Получение списка событий по конкретному коту
 * GET /help/:catId
 */
export function useHelpByCatId(catId: CatId) {
  return useQuery<GetCatHelpResponseDto>({
    queryKey: helpRequestQueryKeys.byCatId(catId),
    queryFn: () => getHelpRequestByCat(catId),
    placeholderData: (prev) => prev,
  })
}

/**
 * Создание Запроса о помощи.
 *
 * POST /help/:catId
 */

type CreateHelpRequestVariables = {
  catId: CatId
  data: CreateHelpRequestDto
}

export function useCreateHelpRequest() {
  const queryClient = useQueryClient()

  return useMutation<HelpRequestDto, Error, CreateHelpRequestVariables>({
    mutationFn: ({ catId, data }) => createHelpRequest(catId, data),

    onSuccess: async (_createdRequest, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: helpRequestQueryKeys.byCatId(variables.catId),
        }),
        queryClient.invalidateQueries({
          queryKey: helpRequestQueryKeys.lists(),
        }),
      ])
    },
  })
}
