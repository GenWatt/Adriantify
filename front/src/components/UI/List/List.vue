<template>
  <div class="w-screen absolute bg-secondary p-2 rounded" id="search-list">
    <div v-if="props.results.songs.length">
      <Header>Songs:</Header>
      <ul class="h-48 overflow-y-auto">
        <SongItem :song="item" v-for="item in props.results.songs" :key="item._id" />
      </ul>
    </div>
    <Text class="text-center" v-else>No songs results</Text>
    <div v-if="props.results.playlists.length">
      <Header>Playlists:</Header>
      <ul class="h-48 flex flex-wrap overflow-y-auto">
        <PlaylistItem :playlist="item" v-for="item in props.results.playlists" :key="item._id" :small="true" />
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from '../Typography/Header.vue'
import SongItem from '../SongItem/SongItem.vue'
import PlaylistItem from '../../DynamicComponents/PlaylistItem/PlaylistItem.vue'
import Text from '../Text/Text.vue'
import { PlaylistsAndSongs } from '../../../store/playlist'
import { onMounted, onUnmounted } from 'vue'

interface Props {
  results: PlaylistsAndSongs
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const handleClose = (e: any) => {
  if (e.target.id !== 'search-list' || !e.target.closest('#search-list')) {
    emits('close')
  }
}

onMounted(() => {
  window.addEventListener('click', handleClose)
})

onUnmounted(() => {
  window.addEventListener('click', handleClose)
})
</script>
