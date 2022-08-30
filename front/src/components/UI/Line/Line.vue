<template>
  <span :class="`block ${classWidth} ${classHeight} bg-secondary ${className || ''}`"> </span>
</template>

<script lang="ts" setup>
interface Props {
  width?: string
  height?: string
  className?: string
}

const { width, height, className } = defineProps<Props>()
const classWidth = width || 'w-full'
const classHeight = height || 'h-0.5'
</script>
