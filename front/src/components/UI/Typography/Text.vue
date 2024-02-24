<template>
  <div ref="container" :class="{ 'overflow-hidden': slide }">
    <p 
      ref="text"
      :class="`text-left tracking-wide ${className} ${className2}`">
      <slot />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onMounted, onUpdated } from 'vue'
import { computed } from 'vue-demi'
import useBounding from '../../../Hooks/useBounding'

type Props = { type?: 'title' | 'subtitle' | 'content', slide?: boolean, className?: string }
const { type, slide, className } = defineProps<Props>()
const container: Ref<HTMLElement | null> = ref(null)
const text: Ref<HTMLElement | null> = ref(null)
const { isOverflowing } = useBounding()

const setSlide = () => {
  if (container.value && text.value && slide && isOverflowing(text as Ref<HTMLElement>))
    container.value.classList.add('slide')
  else 
    container.value?.classList.remove('slide')
}

onUpdated(() => {
  setSlide()
})

onMounted(() => {
  setSlide()
})

const className2 = computed(() => {
  switch (type) {
    case 'title':
      return `font-bold`
  case 'subtitle':
      return 'text-slate-300 text-xs'
    case 'content':
      return 'text-slate-200'
    default:
      return 'text-slate-200'
  }
})
</script>

<style scoped>
.slide {
  width: 100%;
}

.slide p {
  animation: 7s slide infinite;
}

@keyframes slide {
  0%,
  100% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(-100%);
  }
}
</style>

