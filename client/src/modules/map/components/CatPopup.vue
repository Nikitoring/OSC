<template>
  <q-card>
    <q-card-section> Кличка: {{ props.cat.name }} </q-card-section>
    <q-card-section></q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { ICat } from '../../../domains/index'

const props = withDefaults(defineProps<{ cat: ICat }>(), {
  cat: () => ({}),
})
</script>

<style scoped></style>
