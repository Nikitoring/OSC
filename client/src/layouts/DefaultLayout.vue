<template>
  <q-layout class="bg-grey-3">
    <q-header elevated style="background: #ff9a8b" height-hint="61.59">
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn
          round
          dense
          flat
          :ripple="false"
          :icon="fasPaw"
          size="19px"
          color="dark"
          class="q-mr-sm"
          no-caps
        >
        </q-btn>

        <div
          v-if="$q.screen.gt.sm"
          class="OSC__toolbar-link q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap"
        >
          <a href="javascript:void(0)" class="text-white"> Cat maps </a>
          <a href="javascript:void(0)" class="text-white"> Add cat </a>
          <a href="javascript:void(0)" class="text-white"> About </a>
        </div>

        <q-space />

        <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
          <q-btn v-if="userInfo && userInfo.email" flat no-wrap>
            <q-avatar rounded size="40px" color="green-8">
              {{ userInfo.full_name.charAt(0) }}
            </q-avatar>
            <q-icon name="arrow_drop_down" size="16px" />

            <q-menu auto-close>
              <q-list dense>
                <q-item class="OSC__menu-link-signed-in">
                  <q-item-section>
                    <div>
                      Signed in as
                      <strong>
                        <pre>{{ userInfo.full_name }}</pre>
                      </strong>
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="OSC__menu-link">
                  <q-item-section>Your profile</q-item-section>
                </q-item>
                <q-item clickable class="OSC__menu-link">
                  <q-item-section>Your stars</q-item-section>
                </q-item>
                <q-item clickable class="OSC__menu-link">
                  <q-item-section>Your cats</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="OSC__menu-link">
                  <q-item-section>Help</q-item-section>
                </q-item>
                <q-item clickable class="OSC__menu-link">
                  <q-item-section>Sign out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn
            dense
            outline
            no-wrap
            no-caps
            v-if="!userInfo || !userInfo.email"
            @click="onSignIn"
          >
            Sign in
          </q-btn>
          <q-btn dense flat no-caps v-if="!userInfo || !userInfo.email" @click="onRegister"
            >Registration</q-btn
          >
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <main class="q-page q-layout-padding flex flex-center"><router-view /></main>
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
import { ref } from 'vue'

const { userInfo } = storeToRefs(useUserStore())
const { login, register } = useUserStore()
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
