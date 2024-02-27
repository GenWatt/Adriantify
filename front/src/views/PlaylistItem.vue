<template>
  <div>
    <header class="flex justify-between items-center">
      <Header class="flex">
        Playlist:
        <Text class="ml-1 text-secondary" :type="'title'">{{
          playlistData.selectedPlaylist?.title
        }}</Text>
      </Header>
      <PlusCircleIcon
        v-if="playlistData.selectedPlaylist?.user._id === userData.user.id"
        class="w-5 h-5 cursor-pointer"
        @click="handleOpen"
      />
    </header>
    <Text class="'text-secondary'" :type="'subtitle'">
      {{ playlistData.selectedPlaylist?.songs.length }}
      {{ playlistData.selectedPlaylist?.songs.length === 1 ? "song" : "songs" }} in
      playlist
    </Text>
    <teleport to="body">
      <AddSongToPlaylist v-if="isOpen" @close="handleClose" :isOpen="isOpen" />
    </teleport>
    <section>
      <ul v-for="item in playlistData.selectedPlaylist?.songs" :key="item._id">
        <SongItem :song="item" :remove="true" @delete="handleDelete" />
      </ul>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { usePlaylist } from "../store/playlist";
import SongItem from "../components/UI/SongItem/SongItem.vue";
import { SongType } from "../store/songs";
import { PlusCircleIcon } from "@heroicons/vue/outline";
import useAuthFetch, { ApiResponse } from "../Hooks/useAuthFetch";
import axios from "axios";
import Header from "../components/UI/Typography/Header.vue";
import AddSongToPlaylist from "../components/UI/Modals/AddSongToPlaylist.vue";
import Text from "../components/UI/Typography/Text.vue";
import { NotificationTypes, useNotification } from "../store/notification";
import { useUser } from "../store/user";

const router = useRouter();
const playlistId = router.currentRoute.value.params.id as string;
const playlistData = usePlaylist();
const userData = useUser();
const { callApi } = useAuthFetch();
const notificationStore = useNotification();
const isOpen = ref(false);

const handleOpen = () => (isOpen.value = true);
const handleClose = () => (isOpen.value = false);

const handleDelete = async (song: SongType) => {
  const res = await callApi<ApiResponse>(
    "DELETE",
    "/playlist/" + playlistData.selectedPlaylistId,
    {
      data: { songId: song._id },
    }
  );

  if (axios.isAxiosError(res)) {
    res.response &&
      notificationStore.addQuickNotifaction({
        message: res.response.data.message,
        type: NotificationTypes.ERROR,
      });
  } else {
    playlistData.removeSongFromPlaylist(playlistData.selectedPlaylistId, song._id);
    notificationStore.addQuickNotifaction({
      message: res.data.message,
      type: NotificationTypes.SUCCESS,
    });
  }
};

onMounted(async () => {
  if (typeof playlistId !== "string") return;
  await playlistData.getPlaylist(playlistId);
  playlistData.setSelectedPlaylist(playlistId);
});
</script>
