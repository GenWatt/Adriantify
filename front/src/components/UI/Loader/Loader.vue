<template>
  <div class="flex justify-center">
    <MusicNoteIcon class="w-5 h-5 text-secondary loading" />
    <MusicNoteIcon class="w-5 h-5 text-secondary loading delay-one" />
    <MusicNoteIcon class="w-5 h-5 text-secondary loading delay-two" />
    <Text>{{ props.message || '' }}</Text>
  </div>
</template>

<script lang="ts" setup>
import { MusicNoteIcon } from '@heroicons/vue/outline'
import Text from '../Text/Text.vue'

interface Props {
  message?: string
}

const props = defineProps<Props>()
</script>

<style scoped>
.loading {
  animation: loading 0.6s ease-in-out infinite;
}

.delay-one {
  animation-delay: 100ms;
}

.delay-two {
  animation-delay: 200ms;
}

@keyframes loading {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(0.3);
  }
  75% {
    transform: scale(0.7);
  }
  95% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
