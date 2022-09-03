import { defineStore } from 'pinia'

interface MarkState {
  skip: number
  limit: number
  isMoreToFetch: boolean
  isLoading: boolean
}

export const useMarksStore = defineStore('marks', {
  state: () =>
    ({
      skip: 0,
      limit: 21,
      isMoreToFetch: true,
      isLoading: false,
    } as MarkState),
  actions: {
    setLimit(newLimit: number) {
      this.limit = newLimit
    },
    increaseSkip() {
      this.skip += this.limit
    },
    resetMarks() {
      this.skip = 0
      this.isMoreToFetch = true
    },
  },
})
