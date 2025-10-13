<template>
  <div class="fit row wrap justify-center items-start content-start">
    <q-card class="login-card">
      <q-img src="/loginBackground.jpeg">
        <div class="absolute-bottom text-h6">
          Добро пожаловать в OpenStreetCats, пожалуйста войдите в аккаунт
        </div>
      </q-img>

      <q-card-section>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="signIn" label="Войти" />
          <q-tab name="registration" label="Регистрация" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="signIn"><LoginForm /></q-tab-panel>
          <q-tab-panel name="registration">
            <RegistrationForm @success="tab = 'login'" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './components/loginForm.vue'
import RegistrationForm from './components/registrationForm.vue'

const tab = ref('signIn')
</script>

<style scoped lang="scss">
.login-card {
  width: 100%;
  max-width: 500px;
}
</style>
