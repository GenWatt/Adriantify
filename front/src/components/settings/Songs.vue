<template>
  <Loader v-if="songsData.isLoading" />
  <ul v-else>
    <SongItem
      v-if="songsData.songs.length"
      v-for="item in songsData.songs"
      :key="item._id"
      :song="item"
      :duration="true"
      @delete="handleDelete"
      edit
      remove
    />
    <Text v-else>No songs avaliable</Text>
  </ul>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { onMounted } from 'vue'
import useAuthFetch from '../../Hooks/useAuthFetch'
import useSongs from '../../Hooks/useSongs'
import { SongType, useSongsData } from '../../store/songs'
import SongItem, { ApiActionResponse } from '../UI/SongItem/SongItem.vue'
import Text from '../UI/Text/Text.vue'

const { fetchSongs } = useSongs()
const { callApi } = useAuthFetch()
const songsData = useSongsData()

const handleDelete = async (song: SongType) => {
  const res = await callApi<ApiActionResponse>('DELETE', '/songs/' + song._id)
  if (!axios.isAxiosError(res) && res.data.success) {
    songsData.removeSong(song._id)
  } else {
    console.log(res)
  }
}

onMounted(() => {
  fetchSongs()
})
</script>
