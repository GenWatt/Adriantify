<template>
  <nav class="bg-primary/70 w-full backdrop-blur-xl">
    <ul class="flex">
      <NavLink v-for="item in tabs" :key="item.id" :to="item.path">
        <li class="p-4">
          <Text :type="'subtitle'"> {{ item.name }}</Text>
        </li>
      </NavLink>
    </ul>
    <SearchBar
      class="pl-2"
      :show-list="true"
      v-if="!router.currentRoute.value.meta.hideBar"
      :search-params="[{ name: 'playlist', value: '1' }]"
    />
  </nav>
</template>

<script lang="ts" setup>
import { Tab } from './types'
import NavLink from '../Links/NavLink.vue'
import Text from '../Typography/Text.vue'
import { useRouter } from 'vue-router'
import SearchBar from '../../DynamicComponents/SearchBar/SearchBar.vue'

const tabs: Tab[] = [
  { name: 'Songs', id: 1, path: { name: 'Songs' } },
  { name: 'Playlists', id: 2, path: { name: 'Playlist' } },
  { name: 'History', id: 3, path: { name: 'History' } },
]

const router = useRouter()
</script>

<style></style>
