<template>
  <div class="flex justify-center">
    <svg class="animate-spin h-5 w-5 mt-2 bg-secondary" viewBox="0 0 24 24"></svg> {{ props.message || '' }}
  </div>
</template>

<script lang="ts" setup>
interface Props {
  message?: string
}

const props = defineProps<Props>()
</script>
