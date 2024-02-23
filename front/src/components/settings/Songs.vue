<template>
  <Loader v-if="marks.isLoading" />
  <ul ref="songListEl" class="h-80 overflow-y-auto overflow-x-hidden hide-scrollbar">
    <SongItem
      v-for="item in songsData.songs"
      :key="item._id"
      :song="item"
      :duration="true"
      @delete="handleDelete"
      remove
    />
  </ul>
  <Text v-if="!marks.isLoading && !songsData.songs.length">No songs avaliable</Text>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { onMounted, onUnmounted, Ref, ref } from 'vue'
import useAuthFetch, { ApiResponse } from '../../Hooks/useAuthFetch'
import useFetchMore, { FETCH_NAME_OPTIONS } from '../../Hooks/useFetchMore'
import useScroll from '../../Hooks/useScroll'
import { useMarksStore } from '../../store/marks'
import { SongType, useSongsData } from '../../store/songs'
import SongItem from '../UI/SongItem/SongItem.vue'
import Text from '../UI/Typography/Text.vue'
import Loader from '../UI/Loader/Loader.vue'
import { NotificationTypes, useNotification } from '../../store/notification'

const { fetch } = useFetchMore()
const { callApi } = useAuthFetch()
const marks = useMarksStore()
const songsData = useSongsData()
const songListEl: Ref<HTMLUListElement | null> = ref(null)
const scroll = useScroll(songListEl)
const notificationStore = useNotification()

const handleDelete = async (song: SongType) => {
  const res = await callApi<ApiResponse>('DELETE', '/songs/' + song._id)
  if (!axios.isAxiosError(res) && res.data.success) {
    songsData.removeSong(song._id)
    notificationStore.addQuickNotifaction({ message: 'Song removed', type:  NotificationTypes.SUCCESS })
  } else {
    notificationStore.addQuickNotifaction({ message: 'Problem with removing song', type: NotificationTypes.ERROR })
  }
}

const handleScrollList = async () => {
  if (scroll.isBottomOfPage()) {
    await fetch(FETCH_NAME_OPTIONS.SONGS)
  }
}

onMounted(async () => {
  songsData.songs = []
  songListEl.value?.addEventListener('scroll', handleScrollList)
  await fetch(FETCH_NAME_OPTIONS.SONGS)
})

onUnmounted(() => {
  marks.resetMarks()
  songListEl.value?.removeEventListener('scroll', handleScrollList)
})
</script>
