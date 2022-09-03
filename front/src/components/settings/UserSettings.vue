<template>
  <div>
    <header class="py-6">
      <Header :type="'h2'">User settings</Header>
      <Line :class-name="'my-4'" />
    </header>

    <RowBetween>
      <Text>Logout</Text>
      <Button @click="logout" title="Logout">
        <LogoutIcon class="w-4 h-4" />
      </Button>
    </RowBetween>
  </div>
</template>

<script lang="ts" setup>
import Header from '../UI/Typography/Header.vue'
import { LogoutIcon } from '@heroicons/vue/outline'
import Button from '../UI/Buttons/Button.vue'
import { useUser } from '../../store/user'
import Line from '../UI/Line/Line.vue'
import RowBetween from '../UI/Spacing/RowBetween.vue'
import Text from '../UI/Typography/Text.vue'

const userStore = useUser()

const logout = () => {
  userStore.logout()
}
</script>
