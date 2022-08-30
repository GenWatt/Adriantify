<template>
  <p class="text-left" :class="className" v-bind="$attrs"><slot /></p>
</template>

<script lang="ts" setup>
import { computed } from 'vue-demi'

type Props = { type?: 'title' | 'subtitle' | 'content' }
const { type } = defineProps<Props>()
const className = computed(() => {
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

<style></style>
