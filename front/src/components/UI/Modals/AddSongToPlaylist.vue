<template>
  <Modal class="text-text-primary" :isOpen="props.isOpen" @close="handleClose">
    <template #header>
      <Header class="text-left flex">
        Add to playlist:
        <Text class="text-secondary ml-1" :type="'title'">{{ playlistData.selectedPlaylist?.title }}</Text>
      </Header>
    </template>
    <template #content>
      <SearchBar @results="handleResults" @loading="handleLoading" />
      <Text class="text-left my-1" :type="'title'">Add song to playlist</Text>
      <ul class="overflow-x-hidden overflow-y-auto max-h-40" v-if="!isLoading">
        <SongItem
          :song="item"
          v-for="item in songs"
          :key="item._id"
          :controls="true"
          :add="true"
          @add="handleAddToPlaylist"
        />
      </ul>
      <Loader v-else />
      <Text v-if="!songs.length" :type="'subtitle'">Search for song to add to your playlist</Text>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import Modal from '../Modal/Modal.vue'
import Text from '../Typography/Text.vue'
import SearchBar from '../../DynamicComponents/SearchBar/SearchBar.vue'
import useAuthFetch, { ApiResponse } from '../../../Hooks/useAuthFetch'
import Loader from '../Loader/Loader.vue'
import { SongType } from '../../../store/songs'
import { PlaylistsAndSongs, usePlaylist } from '../../../store/playlist'
import axios from 'axios'
import SongItem from '../SongItem/SongItem.vue'
import Header from '../Typography/Header.vue'
import { NotificationTypes, useNotification } from '../../../store/notification'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const songs: Ref<SongType[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const { callApi } = useAuthFetch()
const playlistData = usePlaylist()
const notificationStore = useNotification()
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const handleClose = () => emits('close')

const handleLoading = (isLoadingState: boolean) => (isLoading.value = isLoadingState)

const handleResults = (data: PlaylistsAndSongs) => (songs.value = data.songs)

const handleAddToPlaylist = async (song: SongType) => {
  if (!playlistData.selectedPlaylist) return
  const res = await callApi<ApiResponse>('PUT', '/playlist/addSong/' + playlistData.selectedPlaylistId, {
    data: { songId: song._id },
  })

  if (axios.isAxiosError(res)) {
    res.response &&
      notificationStore.addQuickNotifaction({ message: res.response.data.message, type: NotificationTypes.ERROR })
  } else {
    playlistData.addSongToPlaylist(playlistData.selectedPlaylistId, song)
    notificationStore.addQuickNotifaction({ message: res.data.message, type: NotificationTypes.SUCCESS })
  }
}
</script>
