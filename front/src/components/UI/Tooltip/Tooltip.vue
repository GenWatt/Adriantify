<template>
  <div data-tooltip-target="tooltip-default" data-tooltip-trigger="hover">
    <slot />
  </div>
  <div
    id="tooltip-default"
    role="tooltip"
    class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700"
  >
    {{ message }}erwrwr
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  message: string
}
const { message } = defineProps<Props>()
</script>
