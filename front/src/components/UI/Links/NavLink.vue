<template>
  <router-link class="nav-link" active-class="nav-link-active">
    <slot />
  </router-link>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.nav-link {
  position: relative;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &.nav-link-active {
    opacity: 1;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 0.1rem;
    height: 100%;
    background-color: rgb(23, 181, 185);
    transform: scaleY(0);
    transition: transform 0.2s ease-in-out;
    z-index: 2;
  }

  &::after {
    left: 0;
  }

  &::before {
    right: 0;
  }

  &:hover::after {
    transform: scaleY(1);
  }

  &:hover::before {
    transform: scaleY(1);
  }
}
</style>
