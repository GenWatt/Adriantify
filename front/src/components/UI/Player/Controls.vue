<template>
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
</template>

<script lang="ts" setup>
import { PlayIcon } from '@heroicons/vue/outline'
import { PauseIcon } from '@heroicons/vue/outline'
import { FastForwardIcon } from '@heroicons/vue/outline'
import { RewindIcon } from '@heroicons/vue/outline'
import useAudio from '../../../Hooks/useAudio'
import { useSongsData } from '../../../store/songs'

type Props = { changeRoute?: boolean }

const songData = useSongsData()
const { prevSong, nextSong, changeRoute } = useAudio()
const props = defineProps<Props>()

function prev() {
  prevSong()
  if (songData.currentSong && props.changeRoute) {
    changeRoute(songData.currentSong)
  }
}

function next() {
  nextSong()
  if (songData.currentSong && props.changeRoute) {
    changeRoute(songData.currentSong)
  }
}
</script>

<style></style>
