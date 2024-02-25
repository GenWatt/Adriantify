import { useRouter } from 'vue-router'
import { SongType, useSongsData } from '../store/songs'
import { onMounted, onUpdated } from 'vue'

export default function useAudio() {
  const router = useRouter()
  const songData = useSongsData()

  onMounted(() => {
    updatePrevNext()

  })

  onUpdated(() => {
    updatePrevNext()
  })

  const getCurrentIndex = () => songData.songs.findIndex((song) => song._id === songData.currentSong?._id)

  const findSongByIndex = (index: number) => songData.songs.find((song, i) => i === index) || null

  const isPrevSong = () => {
    const currentIndex = getCurrentIndex()
    if (currentIndex === -1) return false
    return currentIndex - 1 >= 0
  }

  const isNextSong = () => {
    const currentIndex = getCurrentIndex()
    if (currentIndex === -1) return false
    return currentIndex + 1 < songData.songs.length
  }

  const updatePrevNext = () => {
    isPrevSong() ? (songData.isPrevSong = true) : (songData.isPrevSong = false)
    isNextSong() ? (songData.isNextSong = true) : (songData.isNextSong = false)
  }

  const nextSong = (): SongType | null => {
    let currentIndex = getCurrentIndex()

    if (currentIndex === -1) return null
    if (currentIndex + 1 < songData.songs.length) {
      currentIndex++
      const song = findSongByIndex(currentIndex)

      song && changeSong(song)
      updatePrevNext()
      return song
    }

    return null
  }

  const changeSong = (song: SongType) => {
    songData.addCurrentSong(song)
    updatePrevNext()
  }

  const changeRoute = (song: SongType) => {
    router.push({ name: 'Song', params: { id: song._id }, replace: true })
    updatePrevNext()
  }

  const prevSong = (): SongType | null => {
    let currentIndex = getCurrentIndex()

    if (currentIndex === -1) return null
    if (currentIndex - 1 >= 0) {
      currentIndex--
      const song = findSongByIndex(currentIndex)

      song && changeSong(song)
      updatePrevNext()
      return song
    }
    return null
  }

  return { changeSong, nextSong, prevSong, changeRoute }
}
