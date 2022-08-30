<template>
  <Modal class="text-text-primary" @close="handleClose" v-if="props.isOpen">
    <template #header>Add Playlist</template>
    <template #content>
      <div class="text-white">
        <div class="flex justify-between items-center">
          <div>
            <Input
              @keyup="handleChange"
              :text="'Playlist Title'"
              v-model="title"
              :id="'playlistTitle'"
              :name="'playlistTitle'"
            />
          </div>
          <Button @click="createPlaylist" class="mb-2 self-end py-1">Create Playlist</Button>
        </div>
        <Text class="text-text-error text-left">{{ error }}</Text>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import Modal from '../Modal/Modal.vue'
import Text from '../Text/Text.vue'
import useAuthFetch from '../../../Hooks/useAuthFetch'
import { useSongsData } from '../../../store/songs'
import Input from '../../Form/Input.vue'
import Button from '../Buttons/Button.vue'
import { Playlist, usePlaylist } from '../../../store/playlist'
import axios from 'axios'

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

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const title: Ref<string> = ref('')
const error: Ref<string> = ref('')
const { callApi } = useAuthFetch()
const playlistData = usePlaylist()

const handleClose = () => emits('close')

const handleChange = () => title.value && (error.value = '')

const createPlaylist = async () => {
  if (!title.value) return (error.value = 'Provide title')
  const res = await callApi<AddPlaylist>('POST', '/playlist', { data: { title: title.value } })

  if (axios.isAxiosError(res)) {
    console.log(res)
  } else {
    console.log(res)
    playlistData.addPlaylist(res.data.playlist)
  }
}
</script>
