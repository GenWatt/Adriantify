<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppBar from "./components/UI/AppBar/AppBar.vue";
import TabNav from "./components/UI/TabNav/TabNav.vue";
import { useSongsData } from "./store/songs";
import { useUser } from "./store/user";
import MiniPlayer from "./components/DynamicComponents/MiniPlayer/MiniPlayer.vue";
import useScroll from "./Hooks/useScroll";
import setupRouter from "./router/routerGuards";
import useDebounce from "./Hooks/useDebounce";
import { usePlaylist } from "./store/playlist";
import { useSongHistory } from "./store/history";
import NotificationsContainer from "./components/UI/Notification/NotificationsContainer.vue";

const container: Ref<HTMLElement | null> = ref(null);
const mini: Ref<HTMLElement | null> = ref(null);
const containerHeight = ref("60vh");
const router = useRouter();
const user = useUser();
const playlist = usePlaylist();
const songsData = useSongsData();
const history = useSongHistory();
const scroll = useScroll(container);
const { debounce } = useDebounce();

watch(
  () => user.user,
  () => {
    if (!user.isAuth()) {
      user.resetAll();
    }
  }
);

watch(
  () => mini.value,
  () => {
    setContainerHeight();
  }
);

watch(
  () => songsData.currentSong,
  async (curr) => {
    if (curr && curr._id) {
      history.postToHistory(curr._id);
    }
  }
);

const setContainerHeight = () => {
  if (container.value) {
    const miniPlayerElement = document.getElementById("miniPlayer");
    if (songsData.isMiniPlayer && miniPlayerElement) {
      containerHeight.value = `${
        window.innerHeight - container.value.offsetTop - miniPlayerElement.offsetHeight
      }px`;
    } else {
      containerHeight.value = `${window.innerHeight - container.value.offsetTop}px`;
    }
  }
};

const handleScroll = () => {
  if (!scroll.isBottomOfPage()) return;

  switch (router.currentRoute.value.name) {
    case "Songs":
      debounce(songsData.fetchSongs, 100);
      break;
    case "Playlist":
      debounce(playlist.fetchPlaylists, 100);
      break;
    case "History":
      debounce(history.fetchHistory, 100);
      break;
    default:
      break;
  }
};

onMounted(() => {
  setupRouter();
  setContainerHeight();
  songsData.miniPlayerSetup();
  container.value?.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", setContainerHeight);
});

onUnmounted(() => {
  container.value?.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", setContainerHeight);
});
</script>

<template>
  <div class="min-h-screen text-text-primary">
    <AppBar v-if="!router.currentRoute.value.meta.hideNav" />
    <TabNav v-if="!router.currentRoute.value.meta.hideNav" />
    <NotificationsContainer />
    <router-view v-slot="{ route, Component }">
      <transition :name="route.meta.transition">
        <main
          :style="{
            height: containerHeight,
          }"
          ref="container"
          class="overflow-y-auto overflow-x-hidden container mx-auto bg-secondary/5 p-2 mt-2 rounded-xl"
        >
          <component :is="Component" />
        </main>
      </transition>
    </router-view>
    <transition name="expand">
      <MiniPlayer ref="mini" v-if="songsData.isMiniPlayer" />
    </transition>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
