<template>
  <div class="">
    <header class="py-6">
      <Header :type="'h2'">User settings</Header>
      <Line :class-name="'my-4'" />
    </header>

    <div class="flex justify-between">
      <p>Theme</p>
      <select>
        <option value="Dark">Dark</option>
        <option value="Dark">Light</option>
      </select>
    </div>
    <div class="flex justify-between pt-5">
      <p>Logout</p>
      <Button @click="logout" title="Logout">
        <LogoutIcon class="w-5 h-5" />
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from '../UI/Typography/Header.vue'
import { LogoutIcon } from '@heroicons/vue/outline'
import Button from '../UI/Buttons/Button.vue'
import { useUser } from '../../store/user'
import { useRouter } from 'vue-router'
import Line from '../UI/Line/Line.vue'

const userStore = useUser()
const router = useRouter()

const logout = () => {
  userStore.logout()
  router.push({ name: 'Login', replace: true })
}
</script>
