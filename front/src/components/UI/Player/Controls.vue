<template>
  <div :class="`flex ${$props.className}`">
    <div class="flex justify-between h-8 w-full">
      <InputRange
        v-if="props.volume"
        @change="changeVolume"
        :value="volumeValue"
        :min=0
        :max=1
        :show-zip-value="true"
        title="Volume"
      />
      <RewindIcon
        :class="!songData.isPrevSong && 'opacity-70'"
        class="cursor-pointer w-4/12 ml-3"
        title="Rewind"
        @click="prev"
      />
      <PlayIcon v-if="!songData.isPlaying" class="cursor-pointer w-4/12" title="Play" @click="songData.play" />
      <PauseIcon v-else="songData.isPlaying" class="cursor-pointer w-4/12" title="Pause" @click="songData.pause" />
      <FastForwardIcon
        :class="!songData.isNextSong && 'opacity-70'"
        class="cursor-pointer w-4/12"
        title="Fast Forward"
        @click="next"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlayIcon } from '@heroicons/vue/outline'
import { PauseIcon } from '@heroicons/vue/outline'
import { FastForwardIcon } from '@heroicons/vue/outline'
import { RewindIcon } from '@heroicons/vue/outline'
import { onMounted, ref } from 'vue'
import useAudio from '../../../Hooks/useAudio'
import { useSongsData } from '../../../store/songs'
import InputRange from '../../Form/InputRange.vue'

type Props = { changeRoute?: boolean; audio?: HTMLAudioElement; volume?: boolean, className?: string }

const songData = useSongsData()
const { prevSong, nextSong, changeRoute } = useAudio()
const props = defineProps<Props>()
const volumeValue = ref(0)

const prev = () => {
  prevSong()
  if (songData.currentSong && props.changeRoute) {
    changeRoute(songData.currentSong)
  }
}

const next = () => {
  nextSong()
  if (songData.currentSong && props.changeRoute) {
    changeRoute(songData.currentSong)
  }
}

onMounted(() => props.audio && (volumeValue.value = props.audio.volume))

const changeVolume = (newValue: number) => {
  if (props.audio) props.audio.volume = newValue
  volumeValue.value = newValue
}

</script>

<style></style>
