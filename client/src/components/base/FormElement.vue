<template>
  <Component
    :is="componentsMap[props.component]"
    :id="props.id"
    v-bind="props.elementProps"
    v-model="modelValue"
    :rules="rules"
    style="max-width: 300px"
  >
  </Component>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { QInput, QSelect, QDate } from 'quasar'
import type { FormElement } from '@/domains/index'

const componentsMap: Record<string, any> = {
  'q-input': QInput,
  'q-select': QSelect,
  'q-date': QDate,
}
const props = withDefaults(defineProps<FormElement>(), {
  component: 'q-input',
  id: 'form-element-input',
})
const emit = defineEmits<{
  'update:value': [id: string, value: any, event?: string, component?: string]
}>()

const modelValue = ref(null)

const isPwd = ref(true)

const globalRules = {
  required: (val) => !!val || 'Field is required',
  maxVal: (val, maxCount) => val.length <= maxCount || `Please use maximum ${maxCount} characters`,
}
const rules = ref([])
if (props.elementProps?.rules) {
  console.log(props.elementProps.rules)
  rules.value = props.elementProps.rules.reduce((rules, rule) => {
    if (Object.prototype.hasOwnProperty.call(globalRules, rule)) {
      rules.push(globalRules[rule])
    }
    return rules
  }, [])
}

watch(
  () => modelValue.value,
  () => {
    emit('update:value', props.id, modelValue.value)
  },
)
</script>

<style scoped></style>
