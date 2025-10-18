import { createRouter, createWebHistory } from 'vue-router'
import MapPage from '@/modules/map/MapPage.vue'
import LoginPage from '@/modules/personal/LoginPage.vue'
import ProfilePage from '@/modules/personal/ProfilePage.vue'
import AddCatPage from '@/modules/addCat/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: MapPage },
    { path: '/login', component: LoginPage },
    { path: '/profile', component: ProfilePage },
    { path: '/add-cat', component: AddCatPage },
  ],
})

export default router
