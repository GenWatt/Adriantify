<template>
  <div>
    <div class="flex justify-between">
      <label for="song">Add audio</label>
      <input type="file" name="song" id="song" @change="handleChange" accept=".mp4, .mp3" />
    </div>
    <div class="flex justify-between my-4">
      <label for="songImage">Add song image</label>
      <input type="file" name="songImage" id="songImage" @change="handleChange" accept=".jpg, .png, .jpeg" />
    </div>
    <Form :schema="schema" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import useAuthFetch from '../../Hooks/useAuthFetch'
import { SongType, useSongsData } from '../../store/songs'
import Form from '../UI/Form/Form.vue'

interface AddSongData {
  message: string
  success: boolean
  song: SongType
}

const { callApi } = useAuthFetch()
let songData = new FormData()
const songs = useSongsData()
const schema = [
  { type: 'text', name: 'title', label: 'Song title', required: true },
  { type: 'text', name: 'creator', label: 'Song creator' },
  { type: 'date', name: 'release', label: 'Song release' },
  { type: 'text', name: 'album', label: 'Song album' },
  { type: 'submit', name: 'submit', label: 'Submit song' },
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
    console.log(res)
    songs.addSong(res.data.song)
  }

  for (let key in data) {
    songData.delete(key)
  }
}
</script>
