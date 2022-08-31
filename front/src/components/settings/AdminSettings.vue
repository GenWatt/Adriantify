<template>
  <div class="py-6">
    <header>
      <Header :type="'h2'">Admin Panel</Header>
      <Line :class-name="'my-4'" />
    </header>
    <section>
      <section class="flex flex-col">
        <Expendable v-for="(item, index) in adminOptions" :key="index" :title="item.title">
          <component :is="item.component" />
        </Expendable>
      </section>
    </section>
  </div>
</template>

<script lang="ts" setup>
import Header from '../UI/Typography/Header.vue'
import Expendable from '../UI/Expendable/Expendable.vue'
import CreateSong from './CreateSong.vue'
import Songs from './Songs.vue'
import Line from '../UI/Line/Line.vue'

const adminOptions = [
  { component: CreateSong, title: 'Create new song' },
  { component: Songs, title: 'All songs' },
]
</script>
