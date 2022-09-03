<template>
  <div>
    <Form :schema="schema" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import useAuthFetch from '../../Hooks/useAuthFetch'
import { SongType, useSongsData } from '../../store/songs'
import Form from '../Form/Form.vue'
import { NotificationTypes, useNotification } from '../../store/notification'
import { isArray } from '@vue/shared'

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
  { type: 'file', name: 'song', placeholder: 'Add song', required: true, accept: '.mp4, .mp3' },
  { type: 'file', name: 'songImage', placeholder: 'Add song Image', accept: '.jpg, .png, .jpeg' },
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
    if (isArray(data[key]) && data[key].length) songData.append(key, data[key][0])
    else songData.append(key, data[key] || '')
  }

  const res = await callApi<AddSongData>('POST', '/songs', { data: songData })

  if (!axios.isAxiosError(res)) {
    songs.addSong(res.data.song)
    notificationStore.addQuickNotifaction({ type: NotificationTypes.SUCCESS, message: res.data.message })
  } else {
    res.response &&
      notificationStore.addQuickNotifaction({ type: NotificationTypes.ERROR, message: res.response.data.message })
  }

  songData = new FormData()
}
</script>
