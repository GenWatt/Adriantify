<template>
  <div
    aria-label="App bar with logo and user settings"
    class="bg-primary flex p-3 text-text-primary justify-between items-center w-full"
  >
    <div class="flex items-center">
      <router-link :to="{ name: 'Songs' }" class="flex">
        <img src="../../../assets/logo_transparent.png" alt="Adriantfy" class="w-8 h-8" />
        <h1 class="brand-font ml-4 text-xl">Adriantfy</h1>
      </router-link>
    </div>
    <nav>
      <ul class="flex items-center">
        <Tooltip :message="`Hi ${userData.user.username}`">
          <router-link v-for="(item, index) in navConfigRef" :key="item.path" :to="item.path">
            <li :class="index + 1 === navConfigRef.length ? '' : 'mr-4'">
              <component :is="item.icon" class="w-5 h-5" />
            </li>
          </router-link>
        </Tooltip>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { UserCircleIcon } from '@heroicons/vue/outline'
import { NavConfig } from './types'
import { ref, Ref } from 'vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import { useUser } from '../../../store/user'

const navConfig: NavConfig[] = [{ name: 'User', icon: UserCircleIcon, path: '/user' }]

const navConfigRef: Ref<NavConfig[]> = ref(navConfig)
const userData = useUser()
</script>

<style>
.brand-font {
  font-family: 'Permanent Marker', cursive;
}
</style>
