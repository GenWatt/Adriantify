<template>
  <section>
    <div class="flex items-center my-1 overflow-x-auto">
      <div v-for="item in playlistData.playlists" :key="item._id">
        <Text
          :class="`${playlistData.selectedPlaylistId === item._id ? 'bg-secondary px-2 py-1 rounded' : 'mx-2 '}`"
          class="cursor-pointer w-max"
          @click="() => selectPlaylist(item._id)"
          >{{ item.title }}</Text
        >
      </div>
      <Text v-if="!playlistData.playlists.length" :type="'subtitle'">You don't have any playlist</Text>
    </div>
    <Text :type="'title'">Songs in playlist: {{ playlistData.selectedPlaylist?.songs.length }} </Text>
    <ul class="overflow-x-hidden overflow-y-auto max-h-40">
      <SongItem
        class="mr-2"
        :song="item"
        v-if="playlistData.selectedPlaylist"
        v-for="item in playlistData.selectedPlaylist.songs"
        :key="item._id"
        :remove="true"
        :controls="true"
        @delete="handleDelete"
      />
    </ul>
  </section>

  <Text class="my-2" :type="'subtitle'" v-if="!playlistData.selectedPlaylist?.songs.length"
    >This playlist is empty</Text
  >
</template>

<script lang="ts" setup>
import { usePlaylist } from '../../../store/playlist'
import Text from '../../UI/Typography/Text.vue'
import SongItem from '../../UI/SongItem/SongItem.vue'
import { SongType } from '../../../store/songs'
import useAuthFetch, { ApiResponse } from '../../../Hooks/useAuthFetch'
import axios from 'axios'
import { NotificationTypes, useNotification } from '../../../store/notification'

const playlistData = usePlaylist()
const notificationStore = useNotification()
const { callApi } = useAuthFetch()

const handleDelete = async (song: SongType) => {
  const res = await callApi<ApiResponse>('DELETE', '/playlist/' + playlistData.selectedPlaylistId, {
    data: { songId: song._id },
  })

  if (axios.isAxiosError(res)) {
    res.response &&
      notificationStore.addQuickNotifaction({ message: res.response.data.message, type: NotificationTypes.ERROR })
  } else {
    playlistData.removeSongFromPlaylist(playlistData.selectedPlaylistId, song._id)
    notificationStore.addQuickNotifaction({ message: res.data.message, type: NotificationTypes.SUCCESS })
  }
}

const selectPlaylist = (id: string) => playlistData.setSelectedPlaylist(id)
</script>
