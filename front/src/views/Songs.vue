<template>
  <ul>
    <SongItem v-for="item in songsData.songs" :key="item._id" :song="item" />
  </ul>
  <Loader v-if="marks.isLoading" />
  <Text v-if="!songsData.songs.length && !marks.isLoading">No songs found</Text>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import SongItem from '../components/UI/SongItem/SongItem.vue'
import { useSongsData } from '../store/songs'
import Loader from '../components/UI/Loader/Loader.vue'
import { useMarksStore } from '../store/marks'
import Text from "../components/UI/Typography/Text.vue";

const songsData = useSongsData()
const marks = useMarksStore()

onMounted(async () => {
  songsData.songs = []
  songsData.fetchSongs()
})

onUnmounted(() => {
  marks.resetMarks()
})
</script>

<style></style>
