<template>
  <div style="width: 400px">
    <template v-if="!isNewCat">
      <div class="q-mb-sm">
        <div class="text-h6">Кличка:</div>
        <div>{{ props.cat.name }}</div>
      </div>
      <div v-if="props.cat.description" class="q-mb-sm">
        <div class="text-h6">Описание:</div>
        <div>{{ props.cat.description }}</div>
      </div>
    </template>
    <template v-else>
      <div class="text-h6 text-wrap">Добавить кота на карту?</div>
    </template>
    <div class="q-mb-sm">
      <q-btn
        color="primary"
        :flat="!isNewCat"
        size="md"
        :to="!isNewCat ? `/cats/${props.cat.id}` : '/add-cat'"
        >{{ !isNewCat ? 'Вся информация' : 'Добавить' }}</q-btn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ICat } from '../../../domains/index'

const props = withDefaults(defineProps<{ cat: ICat }>(), {
  cat: () => ({}),
})

const isNewCat = computed(() => props.cat.id === 'newCat')
</script>

<style scoped></style>
