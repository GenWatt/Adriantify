<template>
  <h1>History</h1>
  <ul>
    <SongItem v-for="item in historyData.history" :key="item._id" :song="item.song" />
  </ul>
  <Loader v-if="marks.isLoading" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useSongHistory } from '../store/history'
import SongItem from '../components/UI/SongItem/SongItem.vue'
import { useMarksStore } from '../store/marks'
import Loader from '../components/UI/Loader/Loader.vue'

const historyData = useSongHistory()
const marks = useMarksStore()

onMounted(() => {
  historyData.history = []
  historyData.fetchHistory()
})

onUnmounted(() => marks.resetMarks())
</script>

<style></style>
