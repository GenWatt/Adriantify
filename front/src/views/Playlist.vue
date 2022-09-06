<template>
  <header class="flex justify-between items-center">
    <Header>Playlist</Header>
    <div class="flex items-center">
      <PlusIcon class="w-6 h-6 cursor-pointer mr-2" title="Add Playlist" @click="handleOpenCreatePlaylist" />
      <Button class="mr-2" :color="isMyPlaylistMode ? 'bg-primary' : ''" @click="showMyPlaylists">My Playlists</Button>
    </div>
  </header>

  <teleport v-if="isOpenCreatePlaylist" to="body">
    <PlaylistModal :isOpen="isOpenCreatePlaylist" @close="handleCloseCreatePlaylist" />
  </teleport>

  <article class="mt-2" aria-label="Playlist container">
    <PlaylistUl v-if="!isMyPlaylistMode">
      <PlaylistItem v-for="item in playlistData.playlists" :key="item._id" :playlist="item" />
    </PlaylistUl>

    <ul class="flex flex-wrap overflow-y-auto" v-if="isMyPlaylistMode">
      <PlaylistItem
        v-for="item in playlistData.myPlaylists"
        :key="item._id"
        :playlist="item"
        :remove="isMyPlaylistMode"
      />
    </ul>
  </article>
  <Loader v-if="marks.isLoading" />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import PlaylistModal from '../components/UI/Modals/PlaylistModal.vue'
import { PlusIcon } from '@heroicons/vue/outline'
import { usePlaylist } from '../store/playlist'
import PlaylistItem from '../components/DynamicComponents/PlaylistItem/PlaylistItem.vue'
import Header from '../components/UI/Typography/Header.vue'
import Loader from '../components/UI/Loader/Loader.vue'
import { useMarksStore } from '../store/marks'
import Button from '../components/UI/Buttons/Button.vue'
import PlaylistUl from '../components/UI/Spacing/PlaylistUl.vue'

const playlistData = usePlaylist()
const marks = useMarksStore()
const isOpenCreatePlaylist = ref(false)
const isMyPlaylistMode = ref(false)

const handleOpenCreatePlaylist = () => (isOpenCreatePlaylist.value = true)
const handleCloseCreatePlaylist = () => (isOpenCreatePlaylist.value = false)

const loadPlaylists = () => {
  playlistData.playlists = []
  marks.resetMarks()
  playlistData.fetchPlaylists()
  isMyPlaylistMode.value = false
}

const showMyPlaylists = () => {
  if (isMyPlaylistMode.value) return loadPlaylists()
  isMyPlaylistMode.value = true
  playlistData.getMyPlaylists()
}

onMounted(() => {
  playlistData.playlists = []
  playlistData.fetchPlaylists()
})

onUnmounted(() => {
  marks.resetMarks()
})
</script>
