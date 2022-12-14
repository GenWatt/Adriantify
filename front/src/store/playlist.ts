import axios from 'axios'
import { defineStore } from 'pinia'
import useAuthFetch, { ApiResponse } from '../Hooks/useAuthFetch'
import useFetchMore, { FETCH_NAME_OPTIONS } from '../Hooks/useFetchMore'
import { SongType } from './songs'
import { UserType } from './user'

export interface Playlist {
  title: string
  songs: SongType[]
  _id: string
  user: UserType
  path?: string
}

export interface PlaylistsAndSongs {
  playlists: Playlist[]
  songs: SongType[]
  success: boolean
}

interface PlaylistState {
  myPlaylists: Playlist[]
  playlists: Playlist[]
  selectedPlaylistId: string
  selectedPlaylist: Playlist | null
}

export const usePlaylist = defineStore({
  id: 'playlist',
  state: () =>
    ({
      myPlaylists: [],
      playlists: [],
      selectedPlaylistId: '',
      selectedPlaylist: null,
    } as PlaylistState),
  actions: {
    addPlaylists(playlists: Playlist[]) {
      this.playlists = [...this.playlists, ...playlists]
      this.playlists = this.playlists.filter(
        (playlist, index, self) => index === self.findIndex((item) => item._id === playlist._id)
      )
    },
    async fetchPlaylists() {
      const { fetch } = useFetchMore()
      await fetch(FETCH_NAME_OPTIONS.PLAYLISTS)
    },
    async getMyPlaylists() {
      const { callApi } = useAuthFetch()
      const res = await callApi<Playlist[]>('GET', '/playlist/my')

      if (axios.isAxiosError(res)) {
        return
      } else {
        if (!res.data) return
        this.myPlaylists = res.data
      }
    },
    async getPlaylist(id: string) {
      const { callApi } = useAuthFetch()
      if (this.getPlaylisById(id)) return
      const playlistData = await callApi<ApiResponse<Playlist>>('GET', '/playlist/' + id)

      if (axios.isAxiosError(playlistData)) {
      } else {
        if (playlistData.data.data) this.playlists = [...this.playlists, playlistData.data.data]
      }
    },
    getPlaylisById(id: string) {
      return this.playlists.find((playlist) => playlist._id === id) || null
    },
    setSelectedPlaylist(id: string) {
      this.selectedPlaylistId = id
      this.selectedPlaylist = this.getPlaylisById(id)
    },
    addPlaylist(playlist: Playlist) {
      this.playlists = [...this.playlists, playlist]
      this.myPlaylists = [...this.myPlaylists, playlist]
    },
    addSongToPlaylist(playlistId: string, song: SongType) {
      this.playlists = this.playlists.map((playlist) =>
        playlistId === playlist._id ? { ...playlist, songs: [...playlist.songs, song] } : playlist
      )
      this.setSelectedPlaylist(playlistId)
    },
    removeSongFromPlaylist(playlistId: string, songId: string) {
      this.playlists = this.playlists.map((playlist) =>
        playlist._id === playlistId
          ? { ...playlist, songs: playlist.songs.filter((song) => song._id !== songId) }
          : playlist
      )
      if (this.selectedPlaylist)
        this.selectedPlaylist = {
          ...this.selectedPlaylist,
          songs: this.selectedPlaylist.songs.filter((playlist) => playlist._id !== songId),
        }
    },
    removePlaylist(id: string) {
      this.myPlaylists = this.myPlaylists.filter((playlist) => playlist._id !== id)
      this.playlists = this.playlists.filter((playlist) => playlist._id !== id)
    },
    reset() {
      this.playlists = []
      this.myPlaylists = []
      this.selectedPlaylist = null
      this.selectedPlaylistId = ''
    },
  },
})
