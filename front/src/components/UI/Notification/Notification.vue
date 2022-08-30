<template>
  <div :class="`${colorType} bg-secondary p-2`">
    {{ message }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { NotificationTypes } from '../../../store/notification'

interface Props {
  type: NotificationTypes
  message?: string
}

const props = defineProps<Props>()

const message = computed(() => {
  if (props.type === NotificationTypes.LOADER) {
    return `<svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg> ${props.message || 'Processing...'}`
  } else {
    return props.message ? props.message : ''
  }
})

const colorType = computed(() => {
  switch (props.type) {
    case NotificationTypes.ERROR:
      return 'bg-text-error'
    case NotificationTypes.INFO:
      return 'bg-secondary'
    case NotificationTypes.LOADER:
      return 'bg-secondary'
    case NotificationTypes.SUCCESS:
      return 'bg-text-success'
    default:
      return 'bg-secondary'
  }
})
</script>
