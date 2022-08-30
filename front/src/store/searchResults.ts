import axios from 'axios'
import { defineStore } from 'pinia'
import useAuthFetch from '../Hooks/useAuthFetch'
import useUrl, { QueryData } from '../Hooks/useUrl'
import { SongType } from './songs'
import { UserType } from './user'

export interface Playlist {
  title: string
  songs: SongType[]
  _id: string
  user: UserType
}

interface SearchState {
  songs: SongType[]
  playlists: Playlist[]
}

export const useSearch = defineStore({
  id: 'search',
  state: () =>
    ({
      songs: [],
      playlists: [],
    } as SearchState),
  actions: {},
})
