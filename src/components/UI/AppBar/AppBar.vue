<template>
  <div
    aria-label="App Bar"
    class="
      bg-zinc-900
      flex
      p-3
      text-slate-100
      justify-between
      items-center
      w-full
    "
  >
    <div class="flex items-center">
      <router-link to="Home" class="flex">
        <img
          src="../../../assets/logo_transparent.png"
          alt="Adriantfy"
          class="w-8 h-8"
        />
        <h1 class="brand-font ml-4 text-xl">Adriantfy</h1>
      </router-link>
    </div>
    <nav class="">
      <ul class="flex items-center">
        <router-link
          v-for="(item, index) in navConfigRef"
          :key="item.path"
          :to="item.path"
          :title="item.name"
        >
          <li :class="index + 1 === navConfigRef.length ? '' : 'mr-4'">
            <div class="">
              <component :is="item.icon" class="w-5 h-5" />
            </div>
          </li>
        </router-link>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { UserCircleIcon, CogIcon } from "@heroicons/vue/outline";
import { NavConfig } from "./types";
import { ref, Ref } from "vue";

const navConfig: NavConfig[] = [
  { name: "User", icon: "UserCircleIcon", path: "/user" },
  { name: "Settings", icon: "CogIcon", path: "/settings" },
];

export default {
  components: { UserCircleIcon, CogIcon },
  setup() {
    const navConfigRef: Ref<NavConfig[]> = ref(navConfig);

    return { navConfigRef };
  },
};
</script>

<style>
.brand-font {
  font-family: "Permanent Marker", cursive;
}
</style>