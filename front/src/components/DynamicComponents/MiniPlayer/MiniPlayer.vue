<template>
  <section id="miniPlayer" class="flex justify-between bg-secondary-dark items-center w-screen">
    <div class="flex items-center">
      <img
        class="w-12 h-12"
        v-if="songData.currentSong?.imagePath"
        :src="url.getFileUrl(songData.currentSong?.imagePath)"
      />
      <img class="w-12 h-12" v-else src="../../../assets/Nutka.webp" />
      <div class="pl-2">
        <Text :type="'title'">{{ songData.currentSong?.title }}</Text>
        <Text>{{ songData.currentSong?.creator }}</Text>
      </div>
    </div>
    <div class="flex grow">
      <Controls />
      <Timeline v-if="songData.currentAudio" :audio="songData.currentAudio" />
    </div>
    <XIcon @click="handleClosePlayer" class="w-5 h-5 mr-4 cursor-pointer" />
  </section>
</template>

<script lang="ts" setup>
import { useSongsData } from '../../../store/songs'
import Controls from '../../UI/Player/Controls.vue'
import Text from '../../UI/Typography/Text.vue'
import useUrl from '../../../Hooks/useUrl'
import { XIcon } from '@heroicons/vue/outline'
import Timeline from '../../UI/Player/Timeline.vue'

const songData = useSongsData()
const url = useUrl()

const handleClosePlayer = () => {
  songData.setMiniPlayer(false)
}
</script>
