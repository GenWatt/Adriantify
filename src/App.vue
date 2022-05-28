<script setup lang="ts">
import AppBar from "./components/UI/AppBar/AppBar.vue";
import TabNav from "./components/UI/TabNav/TabNav.vue";
</script>

<template>
  <div>
    <AppBar />
    <TabNav />
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
