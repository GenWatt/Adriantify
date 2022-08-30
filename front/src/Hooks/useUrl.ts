import { SERVER_URL } from '../config'

export type QueryData = { name: string; value: string }

export default function useUrl() {
  const getQueryString = (params: QueryData[]) => {
    let paramUrl = '?'

    params?.forEach((param, index) => {
      paramUrl += `${param.name}=${param.value}`
      if (params.length > index + 1) paramUrl += `&`
    })

    return paramUrl
  }

  const getFileUrl = (path: string) => {
    return `${SERVER_URL}/api/${path}`
  }

  return { getQueryString, getFileUrl }
}
