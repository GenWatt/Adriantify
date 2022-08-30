<template>
  <li class="p-2 flex w-3/12 flex-col hover:bg-secondary transition-colors rounded">
    <router-link :to="{ name: 'PlaylistItem', params: { id: props.playlist._id } }">
      <img class="w-full h-full" src="../../../assets/Nutka.webp" />
    </router-link>
    <div class="flex flex-col">
      <Header>{{ props.playlist.title }}</Header>
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
import Text from '../../UI/Text/Text.vue'
import { TrashIcon } from '@heroicons/vue/outline'
import useAuthFetch from '../../../Hooks/useAuthFetch'
import axios from 'axios'

interface Props {
  playlist: Playlist
  remove?: boolean
}

const props = defineProps<Props>()
const { callApi } = useAuthFetch()
const playlistData = usePlaylist()

const handleRemove = async () => {
  const res = await callApi('DELETE', '/playlist/my/' + props.playlist._id)

  if (axios.isAxiosError(res)) {
  } else {
    playlistData.removePlaylist(props.playlist._id)
  }
}
</script>
