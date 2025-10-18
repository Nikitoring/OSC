<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn round dense flat :ripple="false" :icon="fasPaw" size="19px" color="white" no-caps>
          </q-btn>
          OpenStreetCats
        </q-toolbar-title>
        <q-btn v-if="!userInfo || !userInfo.email" flat round dense icon="person" to="/profile" />
        <q-btn v-else round>
          <q-avatar size="36px" text-color="white" color="secondary">
            {{ userInfo.full_name.charAt(0) }}
          </q-avatar>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-footer>
      <q-tabs>
        <q-route-tab to="/" icon="map" />
        <q-route-tab to="/list" icon="list" />
        <q-route-tab to="/add-cat" icon="add" />
        <q-route-tab to="/profile" icon="person"> </q-route-tab>
      </q-tabs>
    </q-footer>

    <q-page-container>
      <q-inner-loading v-if="loading" :showing="loading">
        <q-spinner-clock color="primary" size="16em" />
      </q-inner-loading>
      <main v-else class="q-page q-layout-padding flex justify-center items-start">
        <router-view />
      </main>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { fasPaw } from '@quasar/extras/fontawesome-v6'
import { computed, onBeforeMount, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { initializeAuth, startTokenMonitor, authState } = useAuth()

const loading = ref(false)
onBeforeMount(async () => {
  loading.value = true
  const isAuthenticated = await initializeAuth()
  if (isAuthenticated) {
    // Запускаем мониторинг токена для автоматического обновления
    startTokenMonitor()
  } else {
    // Если не авторизован - показываем окно регистрации
    router.push('/login')
  }
  loading.value = false
})
const userInfo = computed(() => authState.value.user?.user_metadata)
</script>
