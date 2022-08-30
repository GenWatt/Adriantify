<template>
  <Timeline :change-route="true" />
  <Controls :change-route="true" />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue-demi'
import { useSongsData } from '../../../store/songs'
import Controls from './Controls.vue'
import Timeline from './Timeline.vue'

const songData = useSongsData()

onMounted(() => {
  songData.play()
})
</script>

<style></style>
