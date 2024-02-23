<template>
  <div
    @click="handleOutsideClick"
    class="flex justify-center items-center w-screen h-screen fixed top-0 left-0 bg-secondary-dark/10 cursor-pointer"
    :id="overlayId"
  >
    <div class="sm:w-11/12 md:w-8/12 lg:w-6/12 mt-20 text-center bg-secondary-dark/50 rounded p-2 relative cursor-auto">
      <CircleButton :class="'absolute right-0 w-6 h-6'"  @click="emits('close')" >
        <XIcon class="w-6 h-6" />
      </CircleButton>
      <Header :class="'mt-6'" :type="'h1'">
        <slot name="header" />
      </Header>
      <section>
        <slot name="content" />
      </section>
      <div>
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CircleButton from '../Buttons/CircleButton.vue'
import Header from '../Typography/Header.vue'
import { XIcon } from '@heroicons/vue/outline'

interface Emits {
  (e: 'close'): void
}

const emits = defineEmits<Emits>()
const overlayId = 'overlay'

const handleOutsideClick = (e: any) => {
  if (e.target.id === overlayId) {
    emits('close')
  }
}
</script>
