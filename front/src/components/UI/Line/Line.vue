<template>
  <span v-bind="props" :class="`block ${classes}  bg-secondary`"> </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  width?: string
  height?: string
  className?: string
}

const classes = computed(() => `${props.className || ''} ${props.height || 'h-0.5'} ${props.width || 'w-full'}`)

const props = defineProps<Props>()
</script>
