<template>
  <li :class="`${colorType} bg-secondary py-4 px-2 mt-2 rounded relative overflow-hidden`">
    <Line
      :style="{ animationDuration: NOTIFICATION_LIFE_TIME + 'ms' }"
      class="absolute left-0 top-0 load h-1 bg-text-primary"
    />
    <XIcon class="w-4 h-4 absolute right-1 top-1 cursor-pointer hover:scale-105 transition-transform" @click="close" />
    <Text>{{ props.notification.message }}</Text>
  </li>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { NotificationType, NotificationTypes, useNotification } from '../../../store/notification'
import { XIcon } from '@heroicons/vue/outline'
import Text from '../Text/Text.vue'
import Line from '../Line/Line.vue'

interface Props {
  notification: NotificationType
}

const props = defineProps<Props>()
const NOTIFICATION_LIFE_TIME = 5000
const notificationStore = useNotification()
let timer: NodeJS.Timer | null = null

onMounted(() => {
  timer = setTimeout(() => {
    notificationStore.setHide(props.notification._id, true)
  }, NOTIFICATION_LIFE_TIME)
})

onUnmounted(() => {
  timer && clearTimeout(timer)
  timer = null
})

const close = () => notificationStore.setHide(props.notification._id, true)

const colorType = computed(() => {
  switch (props.notification.type) {
    case NotificationTypes.ERROR:
      return 'bg-text-error'
    case NotificationTypes.INFO:
      return 'bg-secondary'
    case NotificationTypes.SUCCESS:
      return 'bg-text-success'
    default:
      return 'bg-secondary'
  }
})
</script>

<style scoped>
.load {
  animation: width linear;
}

@keyframes width {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
