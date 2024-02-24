<template>
  <section id="miniPlayer" class="flex sm:flex-row flex-col justify-between bg-secondary-dark items-center w-screen">
    <div class="flex items-center sm:w-4/12 w-full overflow-hidden">
      <img
        class="w-10 h-10"
        v-if="songData.currentSong?.imagePath"
        :src="url.getFileUrl(songData.currentSong?.imagePath)"
      />
      <img class="w-12 h-12" v-else src="../../../assets/Nutka.webp" />
      <div class="pl-2 w-full">
        <Text :slide="true" className="whitespace-nowrap">{{ songData.currentSong?.title }}</Text>
      </div>
    </div>
    <div class="flex grow w-full sm:mt-0 mt-2">
      <Controls className="sm:w-full w-6/12" />
      <Timeline v-if="songData.currentAudio" :audio="songData.currentAudio" />
    </div>
    <XIcon @click="handleClosePlayer" class="w-5 h-5 mx-1 cursor-pointer sm:relative absolute right-0" />
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
