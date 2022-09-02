<template>
  <div>
    <RowBetween>
      <FileInput
        :label="'Add Song'"
        :inputLabel="MusicNoteIcon"
        name="song"
        @change="handleChange"
        accept=".mp4, .mp3"
      />
    </RowBetween>
    <RowBetween class="mt-2">
      <FileInput
        :inputLabel="PhotographIcon"
        :label="'Add song image'"
        name="songImage"
        @change="handleChange"
        accept=".jpg, .png, .jpeg"
      />
    </RowBetween>
    <Form :schema="schema" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import useAuthFetch from '../../Hooks/useAuthFetch'
import { SongType, useSongsData } from '../../store/songs'
import Form from '../UI/Form/Form.vue'
import FileInput from '../Form/FileInput.vue'
import { PhotographIcon, MusicNoteIcon } from '@heroicons/vue/outline'
import RowBetween from '../UI/Spacing/RowBetween.vue'
import { NotificationTypes, useNotification } from '../../store/notification'

interface AddSongData {
  message: string
  success: boolean
  song: SongType
}

const { callApi } = useAuthFetch()
const notificationStore = useNotification()
let songData = new FormData()
const songs = useSongsData()
const schema = [
  { type: 'text', name: 'title', placeholder: 'Song title', required: true },
  { type: 'text', name: 'creator', placeholder: 'Song creator' },
  { type: 'date', name: 'release', placeholder: 'Song release' },
  { type: 'text', name: 'album', placeholder: 'Song album' },
  { type: 'submit', name: 'submit', placeholder: 'Submit song' },
]

const handleChange = async (e: any) => {
  if (e.target.files) {
    for (let i = 0; i < e.target.files.length; i++) {
      if (songData.has(e.target.name)) {
        songData.delete(e.target.name)
      }
      songData.append(e.target.name, e.target.files[i])
    }
  }
}

const handleSubmit = async (data: any) => {
  for (let key in data) {
    songData.append(key, data[key] || '')
  }

  const res = await callApi<AddSongData>('POST', '/songs', { data: songData })

  if (!axios.isAxiosError(res) && res.data.success) {
    songs.addSong(res.data.song)
    notificationStore.addQuickNotifaction({ type: NotificationTypes.SUCCESS, message: res.data.message })
  }

  for (let key in data) {
    songData.delete(key)
  }
}
</script>
