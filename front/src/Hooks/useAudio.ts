import { useRouter } from 'vue-router'
import { SongType, useSongsData } from '../store/songs'

export default function useAudio() {
  const router = useRouter()
  const songData = useSongsData()

  const getCurrentIndex = () => songData.songs.findIndex((song) => song._id === songData.currentSong?._id)

  const findSongByIndex = (index: number) => songData.songs.find((song, i) => i === index) || null

  const nextSong = (): SongType | null => {
    let currentIndex = getCurrentIndex()

    if (currentIndex === -1) return null
    if (currentIndex + 1 < songData.songs.length) {
      currentIndex++
      const song = findSongByIndex(currentIndex)
      const next = findSongByIndex(currentIndex + 1)
      next ? (songData.isNextSong = true) : (songData.isNextSong = false)
      song && changeSong(song)
      return song
    }
    return null
  }

  const changeSong = (song: SongType) => songData.addCurrentSong(song)

  const changeRoute = (song: SongType) => router.push({ name: 'Song', params: { id: song._id }, replace: true })

  const prevSong = (): SongType | null => {
    let currentIndex = getCurrentIndex()

    if (currentIndex === -1) return null
    if (currentIndex - 1 >= 0) {
      currentIndex--
      const song = findSongByIndex(currentIndex)
      const prev = findSongByIndex(currentIndex - 1)
      prev ? (songData.isPrevSong = true) : (songData.isPrevSong = false)
      song && changeSong(song)
      return song
    }
    return null
  }

  return { changeSong, nextSong, prevSong, changeRoute }
}
