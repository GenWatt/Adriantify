<template>
  <div class="flex w-8/12">
    <InputRange
      class="md:w-2/12 md:block hidden"
      v-if="props.volume"
      @change="changeVolume"
      ref="volumeEl"
      type="range"
      min="0"
      max="1"
      step="0.01"
    />
    <div class="flex justify-center w-8/12 h-8">
      <RewindIcon
        :class="!songData.isPrevSong && 'opacity-70'"
        class="cursor-pointer w-4/12"
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
import { onMounted, ref, Ref } from 'vue'
import useAudio from '../../../Hooks/useAudio'
import { useSongsData } from '../../../store/songs'
import InputRange from '../../Form/InputRange.vue'

type Props = { changeRoute?: boolean; audio?: HTMLAudioElement; volume?: boolean }

const songData = useSongsData()
const { prevSong, nextSong, changeRoute } = useAudio()
const props = defineProps<Props>()
const volumeEl: Ref<HTMLInputElement | null> = ref(null)

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

onMounted(() => volumeEl.value && props.audio && (volumeEl.value.value = props.audio.volume.toString()))

const changeVolume = (e: any) => {
  if (props.audio) props.audio.volume = e.target.value
}
</script>

<style></style>
