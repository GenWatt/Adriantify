<template>
  <Tippy theme="primary" :content="message">
    <slot />
  </Tippy>
</template>

<script lang="ts" setup>
import { Tippy } from 'vue-tippy'
interface Props {
  message: string
}
const { message } = defineProps<Props>()
</script>
