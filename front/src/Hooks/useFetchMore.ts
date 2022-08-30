import axios from 'axios'
import { useSongHistory } from '../store/history'
import { useMarksStore } from '../store/marks'
import { usePlaylist } from '../store/playlist'
import { useSongsData } from '../store/songs'
import useAuthFetch, { ApiResponse } from './useAuthFetch'
import useUrl, { QueryData } from './useUrl'

export enum FETCH_NAME_OPTIONS {
  PLAYLISTS = 'playlists',
  SONGS = 'songs',
  HISTORY = 'history',
}

export const setData = (data: any[], name: FETCH_NAME_OPTIONS) => {
  switch (name) {
    case FETCH_NAME_OPTIONS.SONGS:
      const { addSongs } = useSongsData()
      addSongs(data)
      break
    case FETCH_NAME_OPTIONS.PLAYLISTS:
      const { addPlaylists } = usePlaylist()
      addPlaylists(data)
      break
    case FETCH_NAME_OPTIONS.HISTORY:
      const { addHistory } = useSongHistory()
      addHistory(data)
      break
    default:
      break
  }
}

export default function useFetchMore() {
  const { callApi } = useAuthFetch()
  const { getQueryString } = useUrl()
  const marks = useMarksStore()

  const fetch = async <T>(name: FETCH_NAME_OPTIONS) => {
    if (!marks.isMoreToFetch || marks.isLoading) return
    marks.isLoading = true
    const queryData: QueryData[] = [
      { name: 'skip', value: marks.skip.toFixed() },
      { name: 'limit', value: marks.limit.toFixed() },
    ]
    const res = await callApi<ApiResponse<T[]>>('GET', `/${name}${getQueryString(queryData)}`)

    if (axios.isAxiosError(res)) {
      marks.isLoading = false
    } else {
      if (res.data.data) {
        if (!res.data.data.length) marks.isMoreToFetch = false
        else {
          marks.isMoreToFetch = true
          marks.increaseSkip()
          setData(res.data.data, name)
        }
      }
      marks.isLoading = false
    }
  }

  return { fetch }
}
