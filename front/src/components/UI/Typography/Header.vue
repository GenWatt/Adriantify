<template>
  <h1 :class="`text-${getFontSize()} font-bold tracking-wide ${props.class || ''}`">
    <slot />
  </h1>
</template>

<script lang="ts" setup>
interface Props {
  class?: string
  type?: 'h1' | 'h2' | 'h3'
}
const props = defineProps<Props>()

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
