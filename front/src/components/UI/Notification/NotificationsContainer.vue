<template>
  <TransitionGroup name="slide-left" tag="ul" class="fixed right-2 top-10">
    <Notification v-for="item in notificationStore.getNotHide" :key="item._id" :notification="item" />
  </TransitionGroup>
</template>

<script lang="ts" setup>
import Notification from './Notification.vue'
import { useNotification } from '../../../store/notification'

const notificationStore = useNotification()
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.4s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translate(110%, 0.5rem) scaleX(0.1) rotate(30deg);
}
</style>
