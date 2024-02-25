<template>
  <div>
    <div class="flex gap-2 items-center">
      <label v-if="props.label" class="cursor-pointer text-xs" :for="id">{{ props.label }}</label>
      <div class="flex">
        <Button :class="'w-7 h-7 flex items-center'" type="button" @click="showFileList">
          <component class="w-5 h-5" :is="props.inputLabel" />
        </Button>
      </div>
    </div>
    <Text class="self-end" :type="'subtitle'">{{ fileInfoValue }}</Text>
    <input ref="fileInputEl" class="hidden" v-bind="attrs" type="file" @change="handleChange" />
    <ul>
      <li class="text-left list-disc ml-4" v-for="file in fileNames" :key="file">
        <Text :type="'subtitle'">{{ file }}</Text>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { v4 } from 'uuid'
import { FunctionalComponent, HTMLAttributes, InputHTMLAttributes, ref, Ref, useAttrs, VNodeProps, watch } from 'vue'
import Button from '../UI/Buttons/Button.vue'
import Text from '../UI/Typography/Text.vue'

interface Props extends InputHTMLAttributes {
  label?: string
  inputLabel: FunctionalComponent<HTMLAttributes & VNodeProps, {}>
  clean?: boolean
}

const fileInputEl: Ref<HTMLInputElement | null> = ref(null)
const fileInfoValue = ref('')
const id = v4()
const props = defineProps<Props>()
const attrs = useAttrs()
const fileNames = ref<string[]>([])

const showFileList = () => fileInputEl.value && fileInputEl.value.click()

watch(
  () => props.clean,
  () => { fileInfoValue.value = '', fileNames.value = [] }
)

const handleChange = (e: any) => {
  if (e.target && e.target.files) {
    fileInfoValue.value = `Added ${e.target.files.length} file(s)`

    for (let i = 0; i < e.target.files.length; i++) {
      fileNames.value.push(e.target.files[i].name)
    }
  }
}
</script>
