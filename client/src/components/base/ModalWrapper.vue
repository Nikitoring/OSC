<template>
  <q-dialog v-model="isShow" backdrop-filter="'blur(4px) saturate(150%)'">
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center q-pb-none text-h6">
        {{ props.header }}
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div v-if="props.form && props.form.length">
          <FormElement
            v-for="(field, index) in props.form"
            :key="`${field.id}-${index}`"
            v-bind="field"
            @update:value="setData"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-if="props.approve"
          :label="props.approve.text"
          color="primary"
          @click="props.approve.action(form)"
        />
        <q-btn outline label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormElement from './FormElement.vue'

interface Props {
  header: string
  form?: { [key: string]: any }[]
  approve?: { text: string; action: (form) => void }
}

const isShow = defineModel<boolean>()

const props = withDefaults(defineProps<Props>(), {
  header: '',
})

const form = ref({})
const setData = (id: string, value: any) => {
  form.value[id] = value
}
</script>

<style scoped></style>
