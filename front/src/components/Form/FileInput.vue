<template>
  <label v-if="props.label" class="cursor-pointer" :for="id">{{ props.label }}</label>
  <div class="flex">
    <Button @click="showFileList">
      <component class="w-4 h-4" :is="props.inputLabel" />
    </Button>
    <Text class="ml-2 self-end">{{ fileNames }}</Text>
  </div>
  <input ref="fileInputEl" class="hidden" :id="id" v-bind="attrs" type="file" @change="handleChange" />
</template>

<script lang="ts" setup>
import { v4 } from 'uuid'
import { FunctionalComponent, HTMLAttributes, InputHTMLAttributes, ref, Ref, useAttrs, VNodeProps } from 'vue'
import Button from '../UI/Buttons/Button.vue'
import Text from '../UI/Text/Text.vue'

interface Props extends InputHTMLAttributes {
  label?: string
  inputLabel: FunctionalComponent<HTMLAttributes & VNodeProps, {}>
}

const fileInputEl: Ref<HTMLInputElement | null> = ref(null)
const fileNames = ref('')
const id = v4()
const props = defineProps<Props>()
const attrs = useAttrs()

const showFileList = () => fileInputEl.value && fileInputEl.value.click()

const handleChange = (e: any) => {
  if (e.target && e.target.files) {
    fileNames.value = `Added ${e.target.files.length} file(s)`
  }
}
</script>
