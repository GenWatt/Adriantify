import axios from 'axios'
import { defineStore } from 'pinia'
import useAuthFetch from '../Hooks/useAuthFetch'
import useFetch from '../Hooks/useFetch'
import router from '../router'
import { useSongHistory } from './history'
import { usePlaylist } from './playlist'
import { useSongsData } from './songs'

export interface UserType {
  username: string
  role: string
  id: string
  token: null | string
}

export interface RefreshTokenData {
  newToken: string
  user: Omit<UserType, 'token'>
}

interface UserState {
  user: UserType
}
const { callApi } = useFetch()

const initialState: UserType = {
  username: '',
  id: '',
  token: '',
  role: '',
}

export const useUser = defineStore({
  id: 'user',
  state: () =>
    ({
      user: initialState,
    } as UserState),
  actions: {
    isAuth() {
      return this.user.id && this.user.token
    },

    isUser() {
      return this.user && this.user.role === 'user'
    },

    isAdmin() {
      return this.user && this.user.role === 'admin'
    },

    resetAll() {
      const songsData = useSongsData()
      const playlist = usePlaylist()
      const history = useSongHistory()

      this.reset()
      songsData.reset()
      playlist.reset()
      history.reset()
    },

    async logout() {
      const { callApi } = useAuthFetch()
      const res = await callApi<{ data: { message: string; isAuth: boolean } }>('GET', '/logout')

      if (!axios.isAxiosError(res) && !res.data.data.isAuth) {
        this.resetAll()
        router.push({ name: 'Login', replace: true })
      }
    },
    reset() {
      this.user = initialState
    },
    async refreshUser() {
      let token = ''

      const data = await callApi<RefreshTokenData>('POST', '/refreshToken')
      if (!axios.isAxiosError(data)) {
        if (data.data && data.data.newToken && data.data.user) {
          let newUser: UserType = { ...data.data.user, token: data.data.newToken }
          token = data.data.newToken
          this.addUser(newUser)
        }
      } else {
        if (data.response?.status === 403) {
          this.resetAll()
          router.push({ name: 'Login', replace: true })
        }
      }

      return token
    },

    addUser(newUser: UserType) {
      this.user = newUser
    },
  },
})
