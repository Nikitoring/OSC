<template>
  <q-form ref="loginForm" @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <q-input
      filled
      v-model="email"
      label="Email"
      lazy-rules
      type="email"
      :rules="[(val) => (val && val.length > 0) || '']"
    />
    <q-input
      v-model="password"
      filled
      :type="isPwd ? 'password' : 'text'"
      label="Введите пароль"
      :rules="[(val) => (val && val.length > 0) || '']"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <div>
      <q-btn label="Войти" type="submit" color="primary" />
      <q-btn label="Очитстить форму" type="reset" color="secondary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { login } = useUserStore()
const $q = useQuasar()
const password = ref('')
const isPwd = ref(true)
const email = ref('')

const loginForm = ref(null)

const router = useRouter()

const onSubmit = () => {
  loginForm.value.validate().then(async (success) => {
    if (success) {
      const result = await login({ email: email.value, password: password.value })
      if (result) {
        router.push('/personal')
      }
    } else {
      $q.notify({
        type: 'negative',
        message: 'Ошибка валидации',
      })
    }
  })
}
const onReset = () => {
  password.value = ''
  email.value = ''

  loginForm.value.resetValidation()
}
</script>

<style scoped></style>
