<template>
  <section class="flex justify-between items-center">
    <Header>Playlist</Header>
    <div class="flex items-center">
      <PlusIcon class="w-6 h-6 cursor-pointer mr-2" title="Add Playlist" @click="handleOpenCreatePlaylist" />
      <DotsCircleHorizontalIcon
        :class="isMyPlaylistMode && 'bg-secondary'"
        class="w-6 h-6 cursor-pointer rounded-full"
        title="Show my playlist"
        @click="showMyPlaylists"
      />
    </div>
  </section>

  <teleport v-if="isOpenCreatePlaylist" to="body">
    <PlaylistModal :isOpen="isOpenCreatePlaylist" @close="handleCloseCreatePlaylist" />
  </teleport>

  <ul class="flex flex-wrap" v-if="!isMyPlaylistMode">
    <PlaylistItem v-for="item in playlistData.playlists" :key="item._id" :playlist="item" />
  </ul>

  <ul class="flex flex-wrap overflow-y-auto" v-if="isMyPlaylistMode">
    <PlaylistItem
      v-for="item in playlistData.myPlaylists"
      :key="item._id"
      :playlist="item"
      :remove="isMyPlaylistMode"
    />
  </ul>
  <Loader v-if="marks.isLoading" />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import PlaylistModal from '../components/UI/Modals/PlaylistModal.vue'
import { PlusIcon, DotsCircleHorizontalIcon } from '@heroicons/vue/outline'
import { usePlaylist } from '../store/playlist'
import PlaylistItem from '../components/DynamicComponents/PlaylistItem/PlaylistItem.vue'
import Header from '../components/UI/Typography/Header.vue'
import Loader from '../components/UI/Loader/Loader.vue'
import { useMarksStore } from '../store/marks'

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
  if (!playlistData.myPlaylists.length) playlistData.getMyPlaylists()
}

onMounted(() => {
  playlistData.playlists = []
  playlistData.fetchPlaylists()
})

onUnmounted(() => {
  marks.resetMarks()
})
</script>
