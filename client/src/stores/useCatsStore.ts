import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import type { ICat } from '@/domains'
import { useApi } from '@/composables/useApi'

export const useCatsStore = defineStore('catsStore', () => {
  const $q = useQuasar()
  const { cats: apiCats } = useApi()
  const cats = ref<ICat[]>([])

  const getAllCats = async (filters?: {}) => {
    const { data } = await apiCats.getAll(filters)
    if (data && data.cats) {
      cats.value = data.cats
    }
  }
  return {
    cats,
    getAllCats,
  }
})
