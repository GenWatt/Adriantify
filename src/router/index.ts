import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
// import User from '@/views/User.vue'
// import Settings from '@/views/Settings.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // {
  //   path: '/user',
  //   name: 'User',
  //   component: User,
  // },
  // {
  //   path: '/settings',
  //   name: 'Settings',
  //   component: Settings,
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
