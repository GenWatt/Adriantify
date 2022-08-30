<template>
  <header class="flex justify-between py-4 cursor-pointer" @click="handleExtendable">
    <Header :type="'h3'" class="text-secondary uppercase">{{ title }}</Header>
    <ChevronDownIcon class="w-6 h-6 transition-transform" :class="isExtend ? 'rotate-180' : ''" />
  </header>
  <transition name="expand">
    <slot v-if="isExtend" />
  </transition>
</template>

<script lang="ts" setup>
import { ChevronDownIcon } from '@heroicons/vue/outline'
import { ref } from 'vue'
import Header from '../Typography/Header.vue'

interface Props {
  title: string
}

const isExtend = ref(false)
const { title } = defineProps<Props>()

const handleExtendable = () => (isExtend.value = !isExtend.value)
</script>

<style>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.2s ease, transform 0.2s ease;
  transform-origin: top;
  transform: scaleY(1);
  height: 0;
}

.expand-enter-from {
  transform: scaleY(0);
  height: 100%;
}

.expand-leave-to {
  transform: scaleY(0);
  height: 0;
}
</style>
