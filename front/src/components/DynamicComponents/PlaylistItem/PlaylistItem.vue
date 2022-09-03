<template>
  <li class="p-2 flex w-12/12 md:w-4/12 lg:w-3/12 flex-col hover:bg-secondary transition-colors rounded">
    <router-link :to="{ name: 'PlaylistItem', params: { id: props.playlist._id } }">
      <img
        v-if="props.playlist.path"
        :class="props.small ? 'h-32' : 'h-48'"
        class="w-full"
        :src="getFileUrl(props.playlist.path)"
      />
      <img v-else :class="props.small ? 'h-32' : 'h-48'" class="w-full" src="../../../assets/Nutka.webp" />
    </router-link>
    <div class="flex flex-col">
      <Header :slide="true" class="whitespace-nowrap">{{ props.playlist.title }}</Header>
      <div class="flex justify-between items-center">
        <Text :type="'subtitle'">Created by: {{ props.playlist.user.username }}</Text>
        <TrashIcon v-if="remove" class="w-6 h-6 cursor-pointer" @click="handleRemove" />
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { Playlist, usePlaylist } from '../../../store/playlist'
import Header from '../../UI/Typography/Header.vue'
import Text from '../../UI/Typography/Text.vue'
import { TrashIcon } from '@heroicons/vue/outline'
import useAuthFetch, { ApiResponse } from '../../../Hooks/useAuthFetch'
import axios from 'axios'
import useUrl from '../../../Hooks/useUrl'
import { NotificationTypes, useNotification } from '../../../store/notification'

interface Props {
  playlist: Playlist
  remove?: boolean
  small?: boolean
}

const props = defineProps<Props>()
const { callApi } = useAuthFetch()
const playlistData = usePlaylist()
const notificationStore = useNotification()
const { getFileUrl } = useUrl()

const handleRemove = async () => {
  const res = await callApi<ApiResponse>('DELETE', '/playlist/my/' + props.playlist._id)

  if (axios.isAxiosError(res)) {
    res.response &&
      notificationStore.addQuickNotifaction({ type: NotificationTypes.ERROR, message: res.response.data.message })
  } else {
    playlistData.removePlaylist(props.playlist._id)
    notificationStore.addQuickNotifaction({
      type: NotificationTypes.SUCCESS,
      message: res.data.message,
    })
  }
}
</script>
