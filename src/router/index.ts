import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Settings from '../views/Settings.vue'
import Songs from '../views/Songs.vue'
import Playlist from '../views/Playlist.vue'
import History from '../views/History.vue'
import Library from '../views/Library.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/user',
    name: 'User',
    component: User,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/your-songs',
    name: 'Songs',
    component: Songs,
  },
  {
    path: '/library',
    name: 'Library',
    component: Library,
  },
  {
    path: '/playlist',
    name: 'Playlist',
    component: Playlist,
  },
  {
    path: '/history',
    name: 'History',
    component: History,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
