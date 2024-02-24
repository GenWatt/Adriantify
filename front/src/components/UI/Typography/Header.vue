<template>
  <div ref="container" class="overflow-hidden">
    <h1 ref="header" :class="`text-${getFontSize()} font-bold tracking-wide ${props.class || ''}`">
      <slot />
    </h1>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import useBounding from '../../../Hooks/useBounding'

interface Props {
  class?: string
  type?: 'h1' | 'h2' | 'h3'
  slide?: boolean
}
const props = defineProps<Props>()
const header: Ref<HTMLElement | null> = ref(null)
const container: Ref<HTMLElement | null> = ref(null)
const { isOverflowing } = useBounding()

onMounted(() => {
  if (header.value && container.value && props.slide && isOverflowing(header as Ref<HTMLElement>))
    container.value.classList.add('slide')
})

const getFontSize = () => {
  switch (props.type) {
    case 'h1':
      return '2xl'
    case 'h2':
      return 'xl'
    case 'h3':
      return 'lg'
    default:
      return '2xl'
  }
}
</script>

<style scoped>
.slide {
  width: 100%;
}

.slide h1 {
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
