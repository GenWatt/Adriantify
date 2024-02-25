<template>
  <section
    id="miniPlayer"
    v-if="songData.currentSong"
    class="flex sm:flex-row flex-col justify-between bg-secondary-dark items-center w-screen relative"
  >
    <div class="flex items-center sm:w-4/12 w-full overflow-hidden">
      <img
        class="rounded-lg sm:w-3/12 w-10 h-10"
        v-if="songData.currentSong.imagePath"
        :src="url.getFileUrl(songData.currentSong?.imagePath)"
      />
      <img
        class="rounded-lg sm:w-3/12 w-10 h-10"
        v-else
        src="../../../assets/Nutka.webp"
      />
      <div class="pl-2 w-9/12">
        <Text :slide="true" className="whitespace-nowrap">{{
          songData.currentSong.title
        }}</Text>
      </div>
    </div>
    <div class="flex w-full sm:w-8/12 sm:mt-0 mt-2">
      <Controls className="sm:w-full w-6/12" />
      <Timeline v-if="songData.currentAudio" :audio="songData.currentAudio" />
    </div>
    <Tooltip class="sm:relative absolute right-0 top-1" message="Stop music">
      <XIcon @click="handleClosePlayer" class="w-5 h-5 mx-1 cursor-pointer" />
    </Tooltip>
  </section>
</template>

<script lang="ts" setup>
import { useSongsData } from "../../../store/songs";
import Controls from "../../UI/Player/Controls.vue";
import Text from "../../UI/Typography/Text.vue";
import useUrl from "../../../Hooks/useUrl";
import { XIcon } from "@heroicons/vue/outline";
import Timeline from "../../UI/Player/Timeline.vue";
import Tooltip from "../../UI/Tooltip/Tooltip.vue";

const songData = useSongsData();
const url = useUrl();

const handleClosePlayer = () => {
  songData.setMiniPlayer(false);
};
</script>
