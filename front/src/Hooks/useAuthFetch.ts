import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance, AxiosRequestHeaders } from 'axios'
import { Ref, ref } from 'vue'
import { SERVER_URL } from '../config'
import { UserType, useUser } from '../store/user'
import jwt_decode from 'jwt-decode'

interface TokenData {
  exp: number
  iat: number
  user: Omit<UserType, 'token'>
}

export interface ApiResponse<T = any> {
  message: string
  success: boolean
  data?: T
}

const axiosInstance = axios.create()
let interseptorstInitialized = false

export default function useAuthFetch() {
  const userStore = useUser()
  const isLoading: Ref<boolean> = ref(false)

  const interceptors = (axiosInstance: AxiosInstance) => {
    if (interseptorstInitialized) return
    axiosInstance.interceptors.request.use(
      async (config) => {
        const token = userStore.user.token

        const setTokenToHeader = (token: string) => {
          config.headers = {
            Authorization: `Bearer ${token}`,
          }
        }

        if (token) {
          const tokenData: TokenData = jwt_decode(token)

          if (tokenData.exp - Date.now() > 1) {
            setTokenToHeader(token)
          } else {
            const newToken = await userStore.refreshUser()

            setTokenToHeader(newToken)
          }
        }

        return config
      },
      (err) => {
        Promise.reject(err)
      }
    )

    axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      async function (error) {
        const originalRequest = error.config

        if (error.response.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true
          return axiosInstance(originalRequest)
        } else if (error.response.status === 403 && originalRequest._retry) {
          window.location.href = '/login'
        }

        return Promise.reject(error)
      }
    )
    interseptorstInitialized = true
  }
  interceptors(axiosInstance)

  const callApi = async <T>(
    method: string = 'GET',
    url: string = SERVER_URL,
    options?: AxiosRequestConfig,
    headers?: AxiosRequestHeaders
  ): Promise<AxiosResponse<T> | AxiosError<T>> => {
    if (!url.startsWith('http')) url = SERVER_URL + '/api' + url
    const config: AxiosRequestConfig = {
      method,
      url,
      ...options,
      headers: { ...headers },
      withCredentials: true,
    }
    try {
      isLoading.value = true
      const data: AxiosResponse<T> = await axiosInstance(config)
      isLoading.value = false
      return data
    } catch (error: any) {
      isLoading.value = false
      return error
    }
  }

  return { callApi, isLoading }
}
