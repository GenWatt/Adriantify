import { createWebHistory, createRouter } from 'vue-router'
import User from '../views/User.vue'
import Settings from '../views/Settings.vue'
import Songs from '../views/Songs.vue'
import Playlist from '../views/Playlist.vue'
import History from '../views/History.vue'
import Song from '../views/Song.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import PlaylistItem from '../views/PlaylistItem.vue'

const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { roles: ['admin'] },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { hideNav: true, hideBar: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { hideNav: true, hideBar: true },
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: { auth: true, hideBar: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { auth: true, hideBar: true },
  },
  {
    path: '/songs',
    name: 'Songs',
    component: Songs,
    meta: { transition: 'slide', auth: true },
  },
  {
    path: '/playlists',
    name: 'Playlist',
    component: Playlist,
    meta: { transition: 'slide', auth: true },
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { transition: 'slide', auth: true },
  },
  {
    path: '/songs/:id',
    name: 'Song',
    component: Song,
    meta: { transition: 'slide', auth: true, hideBar: true },
  },
  {
    path: '/playlists/:id',
    name: 'PlaylistItem',
    component: PlaylistItem,
    meta: { transition: 'slide', auth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
