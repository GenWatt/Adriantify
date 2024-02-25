<template>
  <label class="mb-2 flex items-center relative" :for="props.id">
    <div v-if="props.icon" class="bg-secondary-dark">
      <component class="absolute z-10 top-1/2 -translate-y-1/2 left-1 w-5 h-5" :is="props.icon"></component>
    </div>

    <div class="relative" :class="props.wrapperClass && props.wrapperClass">
      <input
        v-bind="attrs"
        :placeholder="props.placeholder"
        :class="props.icon ? 'pl-7' : 'pl-2'"
        class="w-full shadow bg-secondary appearance-none border rounded-lg py-2 border-secondary pr-2 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  </label>
</template>

<script lang="ts" setup>
import { FunctionalComponent, HTMLAttributes, InputHTMLAttributes, useAttrs, VNodeProps } from 'vue'

interface Props extends InputHTMLAttributes {
  icon?: FunctionalComponent<HTMLAttributes & VNodeProps, {}>
  value?: string
  wrapperClass?: string
  placeholder: string
}
const props = defineProps<Props>()
const attrs = useAttrs()
</script>

<style scoped>
input::placeholder {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}
</style>
