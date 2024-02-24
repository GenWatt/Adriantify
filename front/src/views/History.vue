<template>
  <div class="flex justify-between mt-2">
    <Header>History</Header>
    <Button @click="HandleDeleteHistory">Clear history</Button>
  </div>
  <ul>
    <SongItem 
      v-for="item in historyData.history" 
      :key="item._id" 
      :song="item.song" 
      :remove="true" 
      @delete="handleDelete" />
  </ul>
  <Loader v-if="marks.isLoading" />
  <Text :type="'subtitle'" v-if="!historyData.history.length && !marks.isLoading">You didn't listen any song!</Text>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useSongHistory } from '../store/history'
import SongItem from '../components/UI/SongItem/SongItem.vue'
import { useMarksStore } from '../store/marks'
import Loader from '../components/UI/Loader/Loader.vue'
import Header from '../components/UI/Typography/Header.vue'
import { SongType } from '../store/songs'
import { NotificationTypes, useNotification } from '../store/notification'
import Text from '../components/UI/Typography/Text.vue'
import Button from '../components/UI/Buttons/Button.vue'

const historyData = useSongHistory()
const marks = useMarksStore()
const notificationStore = useNotification()

onMounted(async () => {
  historyData.history = []
  await historyData.fetchHistory()
})

onUnmounted(() => marks.resetMarks())

const handleDelete = async (song: SongType) => {
  if(await historyData.deleteFromHistory(song._id)) {
    notificationStore.addQuickNotifaction({ message: 'Song removed from history', type:  NotificationTypes.SUCCESS })
  } else {
    notificationStore.addQuickNotifaction({ message: 'Problem with removing song from history', type: NotificationTypes.ERROR })
  }
}

const HandleDeleteHistory = async () => {
  if(await historyData.deleteAllHistory()) {
    notificationStore.addQuickNotifaction({ message: 'History cleared', type:  NotificationTypes.SUCCESS })
  } else {
    notificationStore.addQuickNotifaction({ message: 'Problem with clearing history', type: NotificationTypes.ERROR })
  }
}

</script>

