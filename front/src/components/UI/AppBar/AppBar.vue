<template>
  <div aria-label="App Bar" class="bg-primary flex p-3 text-text-primary justify-between items-center w-full">
    <div class="flex items-center">
      <router-link to="/home" class="flex">
        <img src="../../../assets/logo_transparent.png" alt="Adriantfy" class="w-8 h-8" />
        <h1 class="brand-font ml-4 text-xl">Adriantfy</h1>
      </router-link>
    </div>
    <nav class="">
      <ul class="flex items-center">
        <router-link v-for="(item, index) in navConfigRef" :key="item.path" :to="item.path">
          <!-- <Tooltip :message="item.name"> -->
          <li :class="index + 1 === navConfigRef.length ? '' : 'mr-4'">
            <component :is="item.icon" class="w-5 h-5" />
          </li>
          <!-- </Tooltip> -->
        </router-link>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { UserCircleIcon, CogIcon } from '@heroicons/vue/outline'
import { NavConfig } from './types'
import { ref, Ref } from 'vue'
import Tooltip from '../Tooltip/Tooltip.vue'

const navConfig: NavConfig[] = [
  { name: 'User', icon: UserCircleIcon, path: '/user' },
  { name: 'Settings', icon: CogIcon, path: '/settings' },
]

const navConfigRef: Ref<NavConfig[]> = ref(navConfig)
</script>

<style>
.brand-font {
  font-family: 'Permanent Marker', cursive;
}
</style>
