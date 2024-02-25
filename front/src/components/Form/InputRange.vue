<template>
    <div class="relative">
      <div
        @click="handleDragEnd"
        ref="fullPathEl"
        class="top-1/2 absolute w-full bg-secondary/40 h-1 cursor-pointer -translate-y-1/2"
      ></div>
      <div ref="pathEl" @click="handleDragEnd" class="top-1/2 absolute bg-secondary h-1 -translate-y-1/2 cursor-pointer"></div>
      <span
        ref="zip"
        @dragend="handleDragEnd"
        @drag="handleDrag"
        @touchend="handleDragEnd"
        @touchmove="handleDrag"
        draggable="true"
        class="top-1/2 -translate-y-1/2 -translate-x-1/2 absolute w-3 h-3 bg-secondary rounded-full cursor-grab hover:bg-secondary/80"
      >
      </span>
    </div>
</template>

<script setup lang="ts">
import { Ref, defineProps, onMounted, ref, watch } from 'vue'
import useConverter from '../../Hooks/useCoverter'
import useBounding from '../../Hooks/useBounding'

type InputRangeProps = {
  value: number
  min: number
  max: number
  showZipValue?: boolean
}

type InputRangeEmits = {
  (e: 'change', value: number): void
}

const props = defineProps<InputRangeProps>()
const emits = defineEmits<InputRangeEmits>()

const { getPercentageFromValues, clamp } = useConverter()
const fullPathEl: Ref<HTMLElement | null> = ref(null)
const pathEl: Ref<HTMLElement | null> = ref(null)
const zip: Ref<HTMLElement | null> = ref(null)
const fullPathCoords = useBounding()
let isDrag = false

onMounted(() => {
  if (fullPathEl.value) fullPathCoords.setup(fullPathEl.value)
})

const handleDragEnd = (e: any) => {
  const eventX = e.changedTouches && e.changedTouches.length ? e.changedTouches[0].pageX : e.x
  const pathWidth = fullPathCoords.getCoords().width
  const newX = eventX - fullPathCoords.getCoords().x
  const percentValue = getPercentageFromValues(newX, pathWidth)
  const newValue = props.max * (percentValue / 100)
  const clampNewValue = clamp(newValue, props.min, props.max)

  updateSlider(clampNewValue)
  emits('change', clampNewValue)
  isDrag = false
}

const handleDrag = (e: any) => {
  const eventX = e.changedTouches && e.changedTouches.length ? e.changedTouches[0].pageX : e.x
  const path = fullPathCoords.getCoords()
  const newX = eventX - path.x
  const newValue = props.max * (getPercentageFromValues(newX, path.width) / 100)
  const clampNewValue = clamp(newValue, props.min, props.max)

  updateSlider(clampNewValue)
  isDrag = true
}

const updateSlider = (newValue: number) => {
  const percent = getPercentageFromValues(newValue, props.max)

  updateTrackValue(percent)
  updateIndicator(percent)
}

const updateTrackValue = (percent: number) => {
  if (pathEl.value) {
    pathEl.value.style.width = `${percent}%`
  }
}

const updateIndicator = (percent: number) => {
  if (zip.value) {
    zip.value.style.left = `${percent}%`
  }
}

watch(() => props.value, (value) => {
    if (isDrag) return
    updateSlider(value)
})

</script>

<style scoped>
</style>
