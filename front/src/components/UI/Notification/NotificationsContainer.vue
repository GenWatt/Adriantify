<template>
  <div>
    <Notification
      v-for="(item, index) in notificationStore.notifications"
      :key="index"
      :type="item.type"
      :message="item.message"
    />
  </div>
</template>

<script lang="ts" setup>
import Notification from './Notification.vue'
import { useNotification } from '../../../store/notification'

const notificationStore = useNotification()
</script>
