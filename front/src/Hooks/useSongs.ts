import { SongType, useSongsData } from '../store/songs'
import useAuthFetch from '../Hooks/useAuthFetch'
import axios from 'axios'
import useUrl, { QueryData } from './useUrl'

export default function useSongs() {
  const songsData = useSongsData()
  const { callApi } = useAuthFetch()

  const fetchSongs = async (skip: number = 0, limit: number = 10) => {
    const { getQueryString } = useUrl()
    const querys: QueryData[] = [
      { name: 'skip', value: skip.toFixed() },
      { name: 'limit', value: limit.toFixed() },
    ]

    songsData.isLoading = true

    const songs = await callApi<SongType[]>('GET', '/songs' + getQueryString(querys))

    if (axios.isAxiosError(songs)) {
      songsData.isLoading = false
      return []
    } else {
      songsData.isLoading = false
      if (!songs.data || !songs.data.length) return []
      songsData.setMarks(limit)
      return songs.data
    }
  }

  const fetchSong = async (id: string) => {
    songsData.isLoading = true
    const song = await callApi<SongType>('GET', '/song/' + id)
    if (axios.isAxiosError(song)) {
      // console.log(songs)
      songsData.isLoading = false
      return null
    } else {
      songsData.isLoading = false
      if (!song.data) return null
      if (songsData.songs.find((song) => song._id === id)) return song.data
      else songsData.addSong(song.data)
      return song.data
    }
  }

  return { fetchSongs, fetchSong }
}
