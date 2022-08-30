import axios from 'axios'
import { defineStore } from 'pinia'
import useAuthFetch from '../Hooks/useAuthFetch'
import useFetch from '../Hooks/useFetch'
import useLocalStorage from '../Hooks/useLocalStorage'
import router from '../router'

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
const { getItem } = useLocalStorage()

const iniitialState: UserType = {
  username: '',
  id: '',
  token: '',
  role: '',
}

export const useUser = defineStore({
  id: 'user',
  state: () =>
    ({
      user: iniitialState,
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

    async logout() {
      const { callApi } = useAuthFetch()
      const res = await callApi<{ data: { message: string; isAuth: boolean } }>('GET', '/logout')

      if (!axios.isAxiosError(res) && !res.data.data.isAuth) {
        this.reset()
      }
    },

    reset() {
      this.user = iniitialState
    },

    async refreshUser() {
      const userId = this.user.id || getItem('id')
      let token = ''

      if (userId) {
        const data = await callApi<RefreshTokenData>('POST', '/refreshToken/' + userId)

        if (!axios.isAxiosError(data)) {
          if (data.data && data.data.newToken && data.data.user) {
            let newUser: UserType = { ...data.data.user, token: data.data.newToken }
            token = data.data.newToken
            this.addUser(newUser)
          }
        } else {
          if (data.response?.status === 403) {
            this.reset()
            router.push({ name: 'Login', replace: true })
          }
        }
      }

      return token
    },

    addUser(newUser: UserType) {
      this.user = newUser
    },
  },
})
