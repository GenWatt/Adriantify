<template>
  <li v-if="computedSong" class="flex justify-between my-1 transition-colors hover:bg-secondary">
    <router-link class="flex w-full cursor-pointer" :to="{ name: 'Song', params: { id: computedSong._id } }">
      <img
        v-if="computedSong.imagePath"
        class="w-12 h-12"
        :src="`${SERVER_URL}/api${computedSong.imagePath}`"
        :alt="computedSong.title"
      />
      <img v-else class="w-12 h-12" src="../../../assets/Nutka.webp" :alt="computedSong.title" />
      <div class="ml-2 grow">
        <Text :type="'title'">{{ computedSong.title }}</Text>
        <Text :type="'subtitle'">{{ computedSong.creator }}</Text>
      </div>
      <Text v-if="duration" :type="'subtitle'" :class="remove || edit ? 'self-center' : ''">{{
        computedSong.time
      }}</Text>
    </router-link>
    <div class="flex items-center">
      <div v-if="controls" :class="buttonClass">
        <PlayIcon
          v-if="!songData.isPlaying || songData.currentSong?._id !== computedSong._id"
          :title="`Play ${computedSong.title}`"
          class="pl-2 w-6 h-6"
          @click="() => songData.addCurrentSong(computedSong)"
        />
      </div>
      <div v-if="controls" :class="buttonClass">
        <PauseIcon
          v-if="songData.isPlaying && songData.currentSong?._id === computedSong._id"
          :title="`Pause ${computedSong.title}`"
          class="pl-2 w-6 h-6"
          @click="songData.pause"
        />
      </div>
      <div v-if="add" :class="buttonClass">
        <PlusIcon title="Add to playlist" class="pl-2 w-6 h-6" @click="() => handleAdd(computedSong as SongType)" />
      </div>
    </div>
    <div class="flex items-center">
      <div v-if="edit" :class="buttonClass" title="Edit this song">
        <PencilIcon class="pl-2 w-6 h-6" />
      </div>
      <div v-if="remove" @click="() => handleRemove(computedSong as SongType)" :class="buttonClass" title="Remove this song">
        <TrashIcon class="pl-2 w-6 h-6" />
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue-demi'
import useConverter from '../../../Hooks/useCoverter'
import { SongType, useSongsData } from '../../../store/songs'
import Text from '../Typography/Text.vue'
import { SERVER_URL } from '../../../config'
import { PencilIcon, TrashIcon } from '@heroicons/vue/outline'
import useAuthFetch from '../../../Hooks/useAuthFetch'
import { PlusIcon, PlayIcon, PauseIcon } from '@heroicons/vue/outline'

type Props = { song: SongType; edit?: boolean; remove?: boolean; add?: boolean; duration?: boolean; controls?: boolean }

interface Emits {
  (e: 'add', song: SongType): void
  (e: 'delete', song: SongType): void
}

const { song, edit, remove, add, controls } = defineProps<Props>()
const emits = defineEmits<Emits>()
const { covertSecondsToTime } = useConverter()
const { callApi } = useAuthFetch()
const songData = useSongsData()

const handleRemove = async (song: SongType) => {
  emits('delete', song)
}

const handleEdit = async (id: string) => {
  const res = await callApi('PUT', '/songs/' + id)
  console.log(res)
}

const handleAdd = (song: SongType) => {
  emits('add', song)
}

const buttonClass = 'flex justify-center  items-center hover:scale-110 cursor-pointer transition-transform'

const computedSong = computed(() => {
  if (!song) {
    return null
  }

  return { ...song, time: covertSecondsToTime(song.duration) }
})
</script>

<style></style>
