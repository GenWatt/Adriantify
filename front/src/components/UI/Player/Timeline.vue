<template>
  <div class="flex justify-center w-full items-center">
    <Text class="mr-5" :type="'subtitle'">{{ covertSecondsToTime(currentTime) }}</Text>
    <div class="relative w-8/12">
      <div
        @click="handleDragEnd"
        ref="fullPathEl"
        class="absolute w-full bg-secondary/60 h-1 cursor-pointer -translate-y-1/2"
      ></div>
      <div ref="pathEl" @click="handleDragEnd" class="absolute bg-secondary h-1 -translate-y-1/2 cursor-pointer"></div>
      <span
        ref="zip"
        @dragend="handleDragEnd"
        @drag="handleDrag"
        draggable="true"
        class="top-1/2 -translate-y-1/2 -translate-x-1/2 absolute w-4 h-4 bg-secondary rounded-full cursor-grab hover:bg-secondary/80"
      ></span>
    </div>
    <Text class="ml-5" :type="'subtitle'">{{ covertSecondsToTime(duration) }}</Text>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, Ref, ref, watch } from 'vue-demi'
import useAudio from '../../../Hooks/useAudio'
import useBounding from '../../../Hooks/useBounding'
import useConverter from '../../../Hooks/useCoverter'
import { useSongsData } from '../../../store/songs'
import Text from '../Text/Text.vue'

type Props = { changeRoute?: boolean }

const props = defineProps<Props>()

const { covertSecondsToTime, getPercentageFromValues } = useConverter()
const fullPathEl: Ref<HTMLElement | null> = ref(null)
const pathEl: Ref<HTMLElement | null> = ref(null)
const zip: Ref<HTMLElement | null> = ref(null)
const zipCoords = useBounding()
const pathCoords = useBounding()
const fullPathCoords = useBounding()
const { nextSong, changeRoute } = useAudio()
const songData = useSongsData()
let isDrag = false
const currentTime = ref(0)
const duration = ref(0)
let audio = songData.currentAudio

const updateTime = () => {
  if (!audio) return
  currentTime.value = audio.currentTime
  duration.value = audio.duration
}

const songEnded = () => {
  const song = nextSong()
  if (song && props.changeRoute) {
    changeRoute(song)
  }
}

onMounted(() => {
  if (!audio) audio = songData.createAudio()
  updateTime()
  audio.addEventListener('canplay', updateTime)
  audio.addEventListener('timeupdate', updateTime)
  audio.addEventListener('ended', songEnded)
})

onUnmounted(() => {
  if (!audio) return
  audio.removeEventListener('canplay', updateTime)
  audio.removeEventListener('timeupdate', updateTime)
  audio.removeEventListener('ended', songEnded)
})

const checkBoundries = (value: number, max: number) => {
  if (value <= 0) {
    return 0
  } else if (value >= max) {
    return max
  } else {
    return value
  }
}

const handleDragEnd = (e: any) => {
  const pathWidth = fullPathCoords.getCoords().width
  const newX = e.x - fullPathCoords.getCoords().x
  let newValue = checkBoundries(newX, pathWidth)

  zipCoords.setStyle('left', `${newValue}px`)

  handleChange((newValue / pathWidth) * 100)
  isDrag = false
}

const handleChange = (value: number) => {
  if (!audio) return
  audio.currentTime = audio.duration * (value / 100)
  songData.play()
}

const handleDrag = (e: any) => {
  const path = fullPathCoords.getCoords()
  const coordsWithPrediction = Object.assign({}, zipCoords.getCoords())

  coordsWithPrediction.x = e.x

  const newX = e.x - path.x
  pathCoords.setStyle('width', `${checkBoundries(newX, path.width)}px`)
  zipCoords.setStyle('left', `${checkBoundries(newX, path.width)}px`)
  isDrag = true
}

onMounted(() => {
  if (zip.value) zipCoords.setup(zip.value)
  if (pathEl.value) pathCoords.setup(pathEl.value)
  if (fullPathEl.value) fullPathCoords.setup(fullPathEl.value)
})

watch(currentTime, () => {
  if (isDrag) return
  const percentage = getPercentageFromValues(currentTime.value, duration.value)

  pathCoords.setStyle('width', `${percentage}%`)
  zipCoords.setStyle('left', `${percentage}%`)
})
</script>

<style></style>
