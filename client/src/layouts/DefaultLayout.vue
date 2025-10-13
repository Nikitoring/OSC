<template>
  <q-layout view="lHh Lpr lFf" style="background-color: #fff8ee">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn round dense flat :ripple="false" :icon="fasPaw" size="19px" color="white" no-caps>
          </q-btn>
          OpenStreetCats
        </q-toolbar-title>
        <q-btn flat round dense icon="person" to="/profile" />
      </q-toolbar>
    </q-header>

    <q-footer>
      <q-tabs>
        <q-route-tab to="/" icon="map" />
        <q-route-tab to="/list" icon="list" />
        <q-route-tab to="/add" icon="add" />
        <q-route-tab to="/profile">
          <q-avatar v-if="!isLoading && userInfo && userInfo.email" rounded color="green-8">
            {{ userInfo.full_name.charAt(0) }}
          </q-avatar>
          <q-icon v-else name="person"></q-icon>
        </q-route-tab>
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <ModalWrapper v-model="isShowModal" v-bind="modalState" />
</template>

<script lang="ts" setup>
import ModalWrapper from '@/components/base/ModalWrapper.vue'
import { fasPaw } from '@quasar/extras/fontawesome-v6'
import { storeToRefs } from 'pinia'
import type { ModalState } from '@/domains/index'
import { useUserStore } from '@/stores/useUserStore'
import { ref, onBeforeMount } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { User } from '../../../server/src/types/user'

const { userInfo, isLoading } = storeToRefs(useUserStore())
const { login, register } = useUserStore()
const { initializeAuth, startTokenMonitor, authState } = useAuth()
const isShowModal = ref(false)
const modalState = ref<ModalState>({
  header: '',
  form: [],
})
const onSignIn = () => {
  isShowModal.value = true
  modalState.value.header = 'Sign in'
  modalState.value.form = [
    {
      component: 'q-input',
      id: 'email',
      elementProps: {
        debounce: '500',
        label: 'E-mail',
        rules: ['required', 'email'],
        type: 'email',
      },
    },
    {
      component: 'q-input',
      id: 'password',
      elementProps: {
        debounce: '500',
        label: 'Password',
        rules: ['required'],
        type: 'password',
      },
    },
  ]
  modalState.value.approve = {
    text: 'Confirm',
    action: (formData) => {
      login(formData)
      isShowModal.value = false
    },
  }
}
const onRegister = () => {
  isShowModal.value = true
  modalState.value.header = 'Registration'
  modalState.value.form = [
    {
      component: 'q-input',
      id: 'username',
      elementProps: {
        debounce: '500',
        label: 'Username',
        rules: ['required'],
      },
    },
    {
      component: 'q-input',
      id: 'email',
      elementProps: {
        debounce: '500',
        label: 'E-mail',
        rules: ['required'],
        type: 'email',
      },
    },
    {
      component: 'q-input',
      id: 'password',
      elementProps: {
        debounce: '500',
        label: 'Password',
        rules: ['required'],
        type: 'password',
      },
    },
  ]
  modalState.value.approve = {
    text: 'Confirm',
    action: (formData) => {
      register(formData)
      isShowModal.value = false
    },
  }
}

onBeforeMount(async () => {
  const isAuthenticated = await initializeAuth()

  if (isAuthenticated) {
    // Запускаем мониторинг токена для автоматического обновления
    startTokenMonitor()
  } else {
    // Если не авторизован - показываем окно регистрации
    onSignIn()
  }
})
</script>

<style lang="sass">
.OSC
  &__select-OSC__menu-link
    .default-type
      visibility: hidden

    &:hover
      background: #0366d6
      color: white
      .q-item__section--side
        color: white
      .default-type
        visibility: visible

  &__toolbar-link
    a
      color: white
      text-decoration: none
      &:hover
        opacity: 0.7

  &__menu-link:hover
    background: #0366d6
    color: white

  &__menu-link-signed-in,
  &__menu-link-status
    &:hover
      & > div
        background: white !important

  &__menu-link-status
    color: $blue-grey-6
    &:hover
      color: $light-blue-9

  &__toolbar-select.q-field--focused
    width: 450px !important
    .q-field__append
      display: none
</style>
