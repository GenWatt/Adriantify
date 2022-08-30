import axios from 'axios'
import { defineStore } from 'pinia'
import useAuthFetch from '../Hooks/useAuthFetch'
import useFetchMore, { FETCH_NAME_OPTIONS } from '../Hooks/useFetchMore'
import { SongType } from './songs'

type HistoryType = {
  song: SongType
  __v: number
  _id: string
  date: number
}

interface HistoryState {
  history: HistoryType[]
}

export const useSongHistory = defineStore({
  id: 'history',
  state: () =>
    ({
      history: [],
    } as HistoryState),
  actions: {
    addToHitsory(history: HistoryType) {
      this.history = [...this.history, history].sort((a, b) => a.date - b.date)
    },
    addHistory(history: HistoryType[]) {
      this.history = [...this.history, ...history]
    },
    async postToHistory(id: string) {
      const { callApi } = useAuthFetch()
      const res = await callApi<{ item: HistoryType; success: boolean; updated: boolean }>('POST', '/history/' + id)

      if (axios.isAxiosError(res)) {
      } else {
        res.data.updated ? this.updateHistory(res.data.item) : this.addToHitsory(res.data.item)
      }
    },
    updateHistory(item: HistoryType) {
      this.history = this.history.map((song) => (song._id === item._id ? item : song)).sort((a, b) => a.date - b.date)
    },
    setHistory(history: HistoryType[]) {
      this.history = history
    },
    async fetchHistory() {
      const { fetch } = useFetchMore()
      await fetch(FETCH_NAME_OPTIONS.HISTORY)
    },
    reset() {
      this.history = []
    },
  },
})
