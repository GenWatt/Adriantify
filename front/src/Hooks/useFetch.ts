import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { SERVER_URL } from '../config'

export default function useFetch() {
  const callApi = async <T>(
    method: string = 'GET',
    url: string = SERVER_URL,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<T> | AxiosError<T>> => {
    if (!url.startsWith('http')) url = SERVER_URL + '/api' + url
    const config: AxiosRequestConfig = {
      method,
      url,
      ...options,
    }
    try {
      const data: AxiosResponse<T> = await axios(config)

      return data
    } catch (error: any) {
      return error
    }
  }

  return { callApi }
}
