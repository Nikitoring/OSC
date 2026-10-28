import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'

import { createCat, getCat, getCats, getLastCats, getCatsStats } from '@/features/cats/api/catsApi'

import type { GetCatsParams, GetCatsResponse } from '@/features/cats/api/catsApi'

import type { Cat, CatId, CatsStats, CreateCatDto } from '@/domains/domains'

/**
 * Query keys
 */
export const catsQueryKeys = {
  all: ['cats'] as const,
  lists: () => [...catsQueryKeys.all, 'list'] as const,
  list: (params: GetCatsParams) => [...catsQueryKeys.lists(), params] as const,
  details: () => [...catsQueryKeys.all, 'detail'] as const,
  detail: (id: CatId) => [...catsQueryKeys.details(), id] as const,
  last: (limit: number) => [...catsQueryKeys.all, 'last', limit] as const,
  stats: () => [...catsQueryKeys.all, 'stats'] as const,
}

/**
 * Получение списка котов.
 *
 * GET /cats
 */
export function useCats(params: GetCatsParams = {}) {
  return useQuery<GetCatsResponse>({
    queryKey: catsQueryKeys.list(params),
    queryFn: () => getCats(params),
    // сохраняем предыдущие значения, когда карта двигается и меняются bounds, чтобы не было "мерцания" списка
    placeholderData: keepPreviousData,
  })
}

/**
 * Получение одного кота.
 *
 * GET /cats/:id
 */
export function useCat(id: CatId | null) {
  return useQuery<Cat>({
    queryKey: catsQueryKeys.detail(id as CatId),
    queryFn: () => getCat(id as CatId),
    enabled: id !== null,
  })
}

/**
 * Создание кота.
 *
 * POST /cats
 */
export function useCreateCat() {
  const queryClient = useQueryClient()

  return useMutation<Cat, Error, CreateCatDto>({
    mutationFn: (data) => createCat(data),

    onSuccess: (createdCat) => {
      /**
       * Кладём кота в кеш деталей,
       * чтобы useCat(createdCat.id) отработал без доп. запроса.
       */
      queryClient.setQueryData(catsQueryKeys.detail(createdCat.id), createdCat)

      /**
       * Все варианты списка котов считаются устаревшими:
       * новый кот мог попасть в любой bounds / фильтр.
       */
      queryClient.invalidateQueries({
        queryKey: catsQueryKeys.lists(),
      })
    },
  })
}

/**
 * Получение последних добавленных котов.
 * GET /cats/last?limit=5
 */
export function useLastCats(limit = 5) {
  return useQuery<Cat[]>({
    queryKey: catsQueryKeys.last(limit),
    queryFn: () => getLastCats(limit),
    placeholderData: (prev) => prev,
  })
}

/**
 * Получение статистики по котам.
 * GET /cats/statistics
 */
export function useCatsStats() {
  // Тип CatsStats нужно будет описать (например: { totalCats: number, catsNeedHelp: number })
  return useQuery<CatsStats>({
    queryKey: catsQueryKeys.stats(),
    queryFn: () => getCatsStats(),
    // Статистику можно обновлять реже, например раз в минуту,
    // или по событиям (создание кота)
    refetchInterval: 60000,
  })
}
