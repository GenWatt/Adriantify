<template>
  <div :class="`flex ${$props.className}`">
    <div class="flex justify-evenly items-center h-8 w-full">
      <Tooltip v-if="props.volume" :message="`Volume: ${(volumeValue * 100).toFixed()}%`">
        <InputRange
          @change="changeVolume"
          :value="volumeValue"
          :min="0"
          :max="1"
          :show-zip-value="true"
          class="sm:w-18 w-14"
        />
      </Tooltip>
      <Tooltip :message="prevSongMessage">
        <RewindIcon
          :class="!songData.isPrevSong && 'opacity-70'"
          class="cursor-pointer sm:w-12 w-8"
          title="Rewind"
          @click="prev"
        />
      </Tooltip>
      <Tooltip v-if="!songData.isPlaying" message="Play">
        <PlayIcon
          class="cursor-pointer sm:w-12 w-8"
          title="Play"
          @click="songData.play"
        />
      </Tooltip>
      <Tooltip v-else="songData.isPlaying" message="Pause">
        <PauseIcon
          class="cursor-pointer sm:w-12 w-8"
          title="Pause"
          @click="songData.pause"
        />
      </Tooltip>
      <Tooltip :message="nextSongMessage">
        <FastForwardIcon
          :class="!songData.isNextSong && 'opacity-70'"
          class="cursor-pointer sm:w-12 w-8"
          @click="next"
        />
      </Tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlayIcon } from "@heroicons/vue/outline";
import { PauseIcon } from "@heroicons/vue/outline";
import { FastForwardIcon } from "@heroicons/vue/outline";
import { RewindIcon } from "@heroicons/vue/outline";
import { onMounted, ref, watch } from "vue";
import useAudio from "../../../Hooks/useAudio";
import { useSongsData } from "../../../store/songs";
import InputRange from "../../Form/InputRange.vue";
import Tooltip from "../Tooltip/Tooltip.vue";

type Props = {
  changeRoute?: boolean;
  audio?: HTMLAudioElement;
  volume?: boolean;
  className?: string;
};

const songData = useSongsData();
const { prevSong, nextSong, changeRoute } = useAudio();
const props = defineProps<Props>();
const volumeValue = ref(0);
const nextSongMessage = ref("Next song");
const prevSongMessage = ref("Previous song");

const setNextSongMessage = () => {
  if (songData.isNextSong) nextSongMessage.value = `Next song`;
  else nextSongMessage.value = `No more songs`;
};

const setPrevSongMessage = () => {
  if (songData.isPrevSong) prevSongMessage.value = `Previous song`;
  else prevSongMessage.value = `No more songs`;
};

watch(
  () => songData.isNextSong,
  () => {
    setNextSongMessage();
  }
);

watch(
  () => songData.isPrevSong,
  () => {
    setPrevSongMessage();
  }
);

const prev = () => {
  prevSong();
  if (songData.currentSong && props.changeRoute) {
    changeRoute(songData.currentSong);
  }
};

const next = () => {
  nextSong();
  if (songData.currentSong && props.changeRoute) {
    changeRoute(songData.currentSong);
  }
};

onMounted(() => {
  props.audio && (volumeValue.value = props.audio.volume);
  setNextSongMessage();
  setPrevSongMessage();
});

const changeVolume = (newValue: number) => {
  if (props.audio) props.audio.volume = newValue;
  volumeValue.value = newValue;
};
</script>

<style></style>
