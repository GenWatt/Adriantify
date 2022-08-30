<template>
  <Loader v-if="marks.isLoading" />
  <div v-else-if="!marks.isLoading && songsData.currentSong" class="flex items-center flex-col mt-6">
    <div class="w-6/12 h-60">
      <img
        class="w-full h-full"
        v-if="songsData.currentSong.imagePath"
        :src="getFileUrl(songsData.currentSong.imagePath)"
        :alt="songsData.currentSong.title"
      />
      <img class="w-full h-full" v-else src="../assets/Nutka.webp" :alt="songsData.currentSong.title" />
    </div>
    <Text class="mt-2 mb-2 text-xl" :type="'title'">{{ songsData.currentSong.title }}</Text>
    <Player v-if="songsData.currentSong" :song="songsData.currentSong" />
  </div>
  <div v-else>
    <Text :type="'title'" class="text-center"> Upsss! Problem with loading this song :-( </Text>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useSongsData } from '../store/songs'
import Text from '../components/UI/Text/Text.vue'
import Player from '../components/UI/Player/Player.vue'
import { onMounted, onUnmounted, watch } from 'vue-demi'
import useSongs from '../Hooks/useSongs'
import Loader from '../components/UI/Loader/Loader.vue'
import useUrl from '../Hooks/useUrl'
import { useSongHistory } from '../store/history'
import { useMarksStore } from '../store/marks'

const router = useRouter()
const songsData = useSongsData()
const historyData = useSongHistory()
const marks = useMarksStore()
const { fetchSong, fetchSongs } = useSongs()
const { getFileUrl } = useUrl()

const getSong = async (id: string) => {
  const song = songsData.songs.find((song) => song._id === id)

  if (song) return songsData.addCurrentSong(song)

  songsData.addCurrentSong(await fetchSong(id))
}

watch(
  () => songsData.currentSong,
  async (curr) => {
    if (curr && curr._id) {
      historyData.postToHistory(curr._id)
    }
  }
)

onMounted(async () => {
  const currentId = router.currentRoute.value.params.id as string

  if (!songsData.songs.length) {
    await songsData.fetchSongs()
  }

  if (songsData.currentSong?._id === currentId) return
  getSong(currentId)
})

onUnmounted(() => marks.resetMarks())
</script>

<style></style>
