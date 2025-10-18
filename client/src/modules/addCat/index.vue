<template>
  <div class="fit row wrap justify-center items-start content-start">
    <q-card class="add-cat-card">
      <q-img src="/addcat.jpeg">
        <div class="absolute-bottom text-h6">Добавить кота на карту</div>
      </q-img>
      <q-card-section>
        <q-form ref="addCatForm" @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <FormElement
            v-for="field in formCatDeclaration"
            :key="field.id"
            v-bind="field"
            @update:value="setValue"
          />
          <div class="fit row nowrap">
            <q-input v-model="formCat.location.latitude" label="Широта" filled class="q-mr-sm" />
            <q-input v-model="formCat.location.longitude" label="Долгота" filled />
          </div>
          <div>
            <q-btn label="Добавить" type="submit" color="primary" />
            <q-btn label="Очитстить форму" type="reset" color="primary" outline class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import FormElement from '@/components/base/FormElement.vue'
import { useApi } from '@/composables/useApi'
import type { ICat, IFormElement } from '@/domains/index'
import { ref } from 'vue'

const { cats } = useApi()
// Если есть доступ к геопозиции заполняем координаты от текущего местоположения
const successPosition = (position: GeolocationPosition) => {
  const latitude = position.coords.latitude
  const longitude = position.coords.longitude
  formCat.value.location = { latitude, longitude }
}
if (navigator?.geolocation) {
  navigator?.geolocation.getCurrentPosition(
    successPosition,
    (err) => {
      console.error(err.message)
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    },
  )
} else {
  console.error('Geolocation is not supported by this browser.')
}

const formCat = ref<Partial<ICat>>({
  name: '',
  description: '',
  location: {
    latitude: null,
    longitude: null,
  },
  health_status: '',
  is_sterilized: false,
  is_friendly: false,
  characteristics: '',
})
const addCatForm = ref(null)
const formCatDeclaration: IFormElement[] = [
  {
    id: 'name',
    component: 'q-input',
    elementProps: {
      label: 'Кличка кота',
      rules: ['required'],
      debounce: '500',
      filled: true,
    },
  },
  {
    id: 'description',
    component: 'q-input',
    elementProps: {
      label: 'Описание',
      debounce: '500',
      type: 'textarea',
      rows: '5',
      filled: true,
    },
  },
  {
    id: 'health_status',
    component: 'q-select',
    elementProps: {
      label: 'Состояние здоровья',
      debounce: '500',
      type: 'textarea',
      rows: '5',
      filled: true,
      options: [
        { value: 'healthy', label: 'Здоров' },
        { value: 'needs_help', label: 'Нужна помощь' },
        { value: 'sick', label: 'Болен' },
      ],
    },
  },
  {
    id: 'is_friendly',
    component: 'q-toggle',
    elementProps: {
      label: 'Дружелюбна',
      value: false,
    },
  },
  {
    id: 'characteristics',
    component: 'q-input',
    elementProps: {
      label: 'Характеристики',
      debounce: '500',
      type: 'textarea',
      rows: '5',
      filled: true,
    },
  },
]
const setValue = (id: keyof ICat, value: string | number | boolean | null) => {
  if (!id) return
  formCat.value[id] = value.value ? value.value : value
}
const onSubmit = () => {
  addCatForm.value.validate().then(async (success) => {
    if (success) {
      const formData = JSON.stringify(formCat.value)
      await cats.create(formData)
    } else {
      $q.notify({
        type: 'negative',
        message: 'Ошибка валидации',
      })
    }
  })
}
const onReset = () => {}
</script>

<style scoped lang="scss">
.add-cat-card {
  width: 100%;
  max-width: 500px;
}
</style>
