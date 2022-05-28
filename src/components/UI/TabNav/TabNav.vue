<template>
  <div class="bg-zinc-900/70 w-full backdrop-blur-xl text-zinc-50">
    <ul class="flex">
      <router-link
        class="tab-route"
        v-for="item in tabsRef"
        :key="item.id"
        :to="item.path"
        active-class="tab-route-active"
        v-slot="{ isExactActive }"
      >
        <li class="p-4">
          <span :class="isExactActive ? 'opacity-100' : 'opacity-70'">{{
            item.name
          }}</span>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref, Ref } from "vue";
import { Tab } from "./types";

const tabs: Tab[] = [
  { name: "Your songs", id: 1, path: "/your-songs" },
  { name: "Playlist", id: 2, path: "/playlist" },
  { name: "Library", id: 3, path: "/library" },
  { name: "History", id: 4, path: "/history" },
];

export default {
  setup() {
    const tabsRef: Ref<Tab[]> = ref(tabs);

    return { tabsRef };
  },
};
</script>

<style>
.tab-route {
  position: relative;
}

.tab-route::before,
.tab-route::after {
  content: "";
  position: absolute;
  top: 0;
  width: 0.1rem;
  height: 100%;
  background-color: aqua;
  transform: scaleY(0);
  transition: transform 0.4s ease-in-out;
  z-index: 2;
}

.tab-route:hover::after {
  left: 0;
  transform: scaleY(1);
}

.tab-route:hover::before {
  right: 0;
  transform: scaleY(1);
}
</style>