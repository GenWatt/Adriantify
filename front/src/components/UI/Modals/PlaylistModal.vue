<template>
  <Modal class="text-text-primary" @close="handleClose" v-if="props.isOpen">
    <template #header>Add Playlist</template>
    <template #content>
      <div class="text-white">
        <Form :schema="schema" @submit="createPlaylist" />
      </div>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from '../Modal/Modal.vue'
import useAuthFetch from '../../../Hooks/useAuthFetch'
import { Playlist, usePlaylist } from '../../../store/playlist'
import axios from 'axios'
import Form, { FromSchema } from '../../Form/Form.vue'
import { NotificationTypes, useNotification } from '../../../store/notification'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

interface AddPlaylist {
  success: boolean
  playlist: Playlist
  message: string
}

type CreatePlaylist = { playlistTitle: string; playlistImage: FileList | '' }

const schema: FromSchema[] = [
  { type: 'text', name: 'playlistTitle', placeholder: 'Playlist title', required: true },
  { type: 'file', name: 'playlistImage', placeholder: 'Playlist image', accept: '.png, .jpg, .jpeg .webp' },
  { type: 'submit', placeholder: 'Create Playlist', name: 'submit' },
]

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const { callApi } = useAuthFetch()
const playlistData = usePlaylist()
const notificationStore = useNotification()
let playlistFormData = new FormData()

const handleClose = () => emits('close')

const createPlaylist = async (data: CreatePlaylist) => {
  playlistFormData.append('title', data.playlistTitle)
  data.playlistImage && data.playlistImage.length && playlistFormData.append('playlistImage', data.playlistImage[0])
  const res = await callApi<AddPlaylist>('POST', '/playlist', { data: playlistFormData })

  if (axios.isAxiosError(res)) {
    res.response &&
      notificationStore.addQuickNotifaction({ type: NotificationTypes.ERROR, message: res.response?.data.message })
  } else {
    playlistData.addPlaylist(res.data.playlist)
    notificationStore.addQuickNotifaction({ type: NotificationTypes.SUCCESS, message: res.data.message })
  }
  playlistFormData = new FormData()
}
</script>
