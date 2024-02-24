<template>
  <Timeline :audio="props.audio" :change-route="true" />
  <Controls className="w-8/12 mt-2" :audio="props.audio" :volume="true" :change-route="true" />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue-demi'
import { useSongsData } from '../../../store/songs'
import Controls from './Controls.vue'
import Timeline from './Timeline.vue'

interface Props {
  audio: HTMLAudioElement
}

const songData = useSongsData()
const props = defineProps<Props>()

onMounted(() => {
  songData.play()
})
</script>

<style></style>
