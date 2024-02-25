<template>
  <div class="flex justify-center w-full items-center">
    <Text class="mr-2" :type="'subtitle'">{{ covertSecondsToTime(currentTime) }}</Text>
    <Tooltip class="w-8/12" :message="`${songData.currentSong?.title} by ${songData.currentSong?.creator}: ${covertSecondsToTime(currentTime)} `">
      <InputRange 
        :max="duration" 
        :min="0" 
        :value="currentTime" 
        @change="handleChange"
        class="w-full" />
    </Tooltip>
    <Text class="ml-2" :type="'subtitle'">{{ covertSecondsToTime(duration) }}</Text>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue-demi'
import useAudio from '../../../Hooks/useAudio'
import useConverter from '../../../Hooks/useCoverter'
import { useSongsData } from '../../../store/songs'
import Text from '../Typography/Text.vue'
import InputRange from '../../Form/InputRange.vue'
import Tooltip from '../Tooltip/Tooltip.vue'

type Props = { changeRoute?: boolean; audio: HTMLAudioElement }

const props = defineProps<Props>()

const { nextSong, changeRoute } = useAudio()
const songData = useSongsData()
const { covertSecondsToTime } = useConverter()
const currentTime = ref(0)
const duration = ref(0)

const updateTime = () => {
  if (!props.audio) return
  currentTime.value = props.audio.currentTime
  duration.value = props.audio.duration
}

const songEnded = () => {
  const song = nextSong()
  if (song && props.changeRoute) {
    changeRoute(song)
  }
}

onMounted(() => {
  if (!props.audio) return
  updateTime()
  props.audio.addEventListener('canplay', updateTime)
  props.audio.addEventListener('timeupdate', updateTime)
  props.audio.addEventListener('ended', songEnded)
})

onUnmounted(() => {
  if (!props.audio) return
  props.audio.removeEventListener('canplay', updateTime)
  props.audio.removeEventListener('timeupdate', updateTime)
  props.audio.removeEventListener('ended', songEnded)
})

const handleChange = (value: number) => {
  if (!props.audio) return
  props.audio.currentTime = value
  songData.play()
}
</script>

<style></style>
