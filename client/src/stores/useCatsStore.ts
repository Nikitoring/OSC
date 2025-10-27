import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import type { ICat } from '@/domains'
import { useApi } from '@/composables/useApi'
import { useRoute, useRouter } from 'vue-router'

export const useCatsStore = defineStore('catsStore', () => {
  const $q = useQuasar()
  const router = useRouter()
  const { cats: apiCats } = useApi()
  const cats = ref<ICat[]>([])
  const newCat = ref<Partial<ICat>>({})

  const getAllCats = async (filters?: {}) => {
    const { data } = await apiCats.getAll(filters)
    if (data && data.cats) {
      cats.value = data.cats
    }
  }

  const createCat = async (formCat: ICat, files?: File[]) => {
    try {
      const formData = new FormData()
      formData.append('name', formCat.name)
      formData.append('description', formCat.description || '')
      formData.append('location', JSON.stringify(formCat.location || {}))
      formData.append('health_status', formCat.health_status)
      formData.append('is_sterilized', JSON.stringify(formCat.is_sterilized))
      formData.append('is_friendly', JSON.stringify(formCat.is_friendly))
      formData.append('characteristics', JSON.stringify(formCat.characteristics || ''))
      if (files && files.length) {
        files.forEach((file) => {
          formData.append('photos', file) // поле должно совпадать с uploadMiddleware.array('photos')
        })
      }
      const { data } = await apiCats.create(formData)
      if (data.data && data.data.id) {
        $q.notify({
          type: 'positive',
          position: 'top',
          message: `Кот(шка) ${data.data.name} успешно добавлен(а) на карту`,
        })
        router.push({
          path: '/',
          query: {
            id: data.data.id,
          },
        })
      }
    } catch (error) {}
  }
  return {
    cats,
    newCat,
    getAllCats,
    createCat,
  }
})
