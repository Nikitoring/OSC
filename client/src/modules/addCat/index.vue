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
          <q-file
            filled
            multiple
            v-model="photos"
            label="Добавьте фотографии кота (макс. 5)"
            :filter="checkFile"
            :max-files="5"
            accept=".jpg, image/*"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <div class="fit row nowrap">
            <q-input
              v-model="formCat.location.latitude"
              :rules="[(val) => !!val || 'Field is required']"
              label="Широта"
              filled
              class="q-mr-sm"
            />
            <q-input
              v-model="formCat.location.longitude"
              :rules="[(val) => !!val || 'Field is required']"
              label="Долгота"
              filled
            />
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
import type { ICat, IFormElement } from '@/domains/index'
import { useCatsStore } from '@/stores/useCatsStore'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue'

const { createCat } = useCatsStore()
const { newCat } = storeToRefs(useCatsStore())
// Если есть доступ к геопозиции заполняем координаты от текущего местоположения
const successPosition = (position: GeolocationPosition) => {
  const latitude = position.coords.latitude
  const longitude = position.coords.longitude
  formCat.value.location = { latitude, longitude }
}

onBeforeMount(() => {
  if (newCat.value.location && newCat.value.location.latitude) {
    formCat.value.location = { ...newCat.value.location }
    return
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
})

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
const photos = ref<File[]>([])
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

const checkFile = (files: File[]) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const maxSize = 10 * 1024 * 1024 // 10MB

  return files.filter((file) => {
    if (!validTypes.includes(file.type)) {
      console.warn(`Файл ${file.name} имеет недопустимый тип`)
      return false
    }
    if (file.size > maxSize) {
      console.warn(`Файл ${file.name} слишком большой`)
      return false
    }
    return true
  })
}

const onSubmit = () => {
  addCatForm.value.validate().then(async (success) => {
    if (success) {
      const prepareData = {
        ...formCat.value,
        location: {
          latitude: Number(formCat.value.location?.latitude),
          longitude: Number(formCat.value.location?.longitude),
        },
      }
      await createCat(prepareData, photos.value)
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
