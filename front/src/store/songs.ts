import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { SERVER_URL } from '../config'
import useFetchMore, { FETCH_NAME_OPTIONS } from '../Hooks/useFetchMore'
import useSongs from '../Hooks/useSongs'

interface SongState {
  songs: SongType[]
  currentSong: null | SongType
  currentAudio: null | HTMLAudioElement
  isPlaying: boolean
  isLoading: boolean
  isMiniPlayer: boolean
  limit: number
  skip: number
  scrollMargin: number
  isNextSong: boolean
  isPrevSong: boolean
  isMoreSongs: boolean
}

export interface SongType {
  title: string
  creator: string
  songPath: string
  release: string
  album: string
  _id: string
  imagePath: string
  size: number
  duration: number
}

export const useSongsData = defineStore({
  id: 'songs',
  state: () =>
    ({
      songs: [],
      skip: 0,
      limit: 11,
      scrollMargin: 200,
      currentSong: null,
      currentAudio: null,
      isPlaying: false,
      isLoading: false,
      isMiniPlayer: false,
      isNextSong: true,
      isPrevSong: true,
      isMoreSongs: true,
    } as SongState),
  actions: {
    createSongs(songs: SongType[]) {
      this.songs = songs
    },
    addSongs(songs: SongType[]) {
      this.songs = [...this.songs, ...songs]
    },
    addSong(song: SongType) {
      this.songs = [...this.songs, song]
    },
    setMarks(limit: number) {
      this.limit = limit
      this.skip += limit
    },
    resetMarks() {
      this.skip = 0
      this.isMoreSongs = true
    },
    removeSong(id: string) {
      this.songs = this.songs.filter((song) => song._id !== id)
    },
    async fetchSongs() {
      const { fetch } = useFetchMore()
      await fetch(FETCH_NAME_OPTIONS.SONGS)
    },
    addCurrentSong(song: SongType | null) {
      if (!this.currentAudio) this.createAudio()
      if (song?.songPath && this.currentAudio) {
        this.currentSong = song
        this.currentAudio.src = `${SERVER_URL}/api${song.songPath}`
        this.play()
      }
    },
    addCurrentAudioElement(audioEl: HTMLAudioElement | null) {
      this.currentAudio = audioEl
    },
    createAudio() {
      if (this.currentAudio) {
        this.pause()
        this.currentAudio.remove()
      }
      const audio = new Audio()

      this.currentAudio = audio
      return audio
    },
    play() {
      if (this.currentAudio) {
        this.currentAudio.play()
        this.isPlaying = !this.currentAudio.paused
      }
    },
    pause() {
      if (this.currentAudio) {
        this.currentAudio.pause()
        this.isPlaying = false
      }
    },
    reset() {
      this.pause()
      this.currentAudio?.remove()
      this.isPlaying = false
      this.currentAudio = null
      this.currentSong = null
      this.isMiniPlayer = false
      this.skip = 0
      this.isMoreSongs = true
    },
    miniPlayerSetup() {
      const router = useRouter()

      router.afterEach(() => {
        if (router.currentRoute.value.name !== 'Song' && router.currentRoute.value.name !== 'User' && this.currentSong)
          this.isMiniPlayer = true
        if (router.currentRoute.value.name === 'Song' || router.currentRoute.value.name === 'User')
          this.isMiniPlayer = false
      })
    },
    setMiniPlayer(open: boolean) {
      this.isMiniPlayer = open
      if (!this.isMiniPlayer) this.reset()
    },
  },
  getters: {
    getSongById(state) {
      return (id: string) => (typeof id === 'string' ? state.songs?.find((song) => song._id === id) : null)
    },
  },
})
