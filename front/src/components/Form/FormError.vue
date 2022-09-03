<template>
  <ul v-if="currentNameErrors">
    <li class="text-text-error text-xs pt-1" v-for="(item, index) in currentNameErrors" :key="index">{{ item }}</li>
  </ul>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ErrorData } from './Form.vue'

interface Props {
  errors?: ErrorData[]
  currentName: string
}
const props = defineProps<Props>()
const currentNameErrors = computed(() => {
  if (!props.errors) return
  for (const error of props.errors) {
    if (error[props.currentName]) {
      return error[props.currentName]
    }
  }
})
</script>
