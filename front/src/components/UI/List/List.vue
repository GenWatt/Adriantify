<template>
  <div class="w-6/12 absolute bg-secondary p-2" id="search-list">
    <div v-if="props.results.songs.length">
      <Header>Songs:</Header>
      <ul>
        <SongItem :song="item" v-for="item in props.results.songs" :key="item._id" />
      </ul>
    </div>
    <Text v-else>No results</Text>
    <div v-if="props.results.playlists.length">
      <Header>Playlists:</Header>
      <ul class="flex flex-wrap">
        <PlaylistItem :playlist="item" v-for="item in props.results.playlists" :key="item._id" />
      </ul>
    </div>
  </div>
  <div class="fixed top-0"></div>
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
