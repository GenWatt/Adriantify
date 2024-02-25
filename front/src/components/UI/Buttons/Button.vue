<template>
  <button
    :class="`${props.class || ''} ${props.color ? props.color : 'bg-secondary'}`"
    class="text-white hover:bg-secondary/80 font-medium rounded-lg text-sm px-2 py-1 focus:outline-none"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { ButtonHTMLAttributes } from 'vue'
interface Props extends ButtonHTMLAttributes {
  color?: string
}

const props = defineProps<Props>()
</script>
