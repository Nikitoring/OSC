import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/modules/main/MainPage.vue'
import LoginPage from '@/modules/personal/LoginPage.vue'
import ProfilePage from '@/modules/personal/ProfilePage.vue'
import { useAuth } from '../composables/useAuth'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: MainPage },
    { path: '/login', component: LoginPage },
    { path: '/profile', component: ProfilePage },
  ],
})

export default router
