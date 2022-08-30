<template>
  <label class="mb-2 flex items-center relative" :for="id">
    <div class="bg-secondary-dark">
      <component class="absolute z-10 top-1/2 -translate-y-1/2 left-1 w-5 h-5" v-if="icon" :is="icon"></component>
    </div>

    <div class="relative">
      <Text
        v-if="!value"
        :type="'subtitle'"
        :class="icon ? 'left-7' : 'left-2'"
        class="absolute top-1/2 -translate-y-1/2 opacity-70 select-none pointer-events-none"
        >{{ text }}</Text
      >
      <input
        v-model="value"
        v-bind="attrs"
        :id="id"
        :class="icon ? 'pl-7' : 'pl-2'"
        class="shadow bg-secondary appearance-none border rounded py-2 border-secondary pr-2 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  </label>
</template>

<script lang="ts" setup>
import { FunctionalComponent, HTMLAttributes, InputHTMLAttributes, ref, Ref, useAttrs, VNodeProps } from 'vue'
import Text from '../UI/Text/Text.vue'

interface Props extends InputHTMLAttributes {
  text: string
  id: string
  icon?: FunctionalComponent<HTMLAttributes & VNodeProps, {}>
}

const value: Ref<string> = ref('')

const { text, id, icon } = defineProps<Props>()
const attrs = useAttrs()
</script>
