<template>
  <div class="pt-4 px-4">
    <header>
      <Header
        >Welcome <span class="text-secondary text-xl">{{ userStore.user.username || 'Guest' }}</span></Header
      >
    </header>
    <Line :class-name="'my-4'" />
    <section class="pt-4">
      <UserSettings />
    </section>
    <section v-if="userStore.isAdmin()" class="pt-4">
      <AdminSettings />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useUser } from '../store/user'
import Header from '../components/UI/Typography/Header.vue'
import UserSettings from '../components/settings/UserSettings.vue'
import AdminSettings from '../components/settings/AdminSettings.vue'
import Line from '../components/UI/Line/Line.vue'

const userStore = useUser()
</script>

<style></style>
