<script setup lang="ts">
import AppBar from "./components/UI/AppBar/AppBar.vue";
</script>

<template>
  <div>
    <AppBar />
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
