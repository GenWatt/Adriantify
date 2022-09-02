<template>
  <div class="flex justify-center flex-col">
    <Header v-if="props.title">
      <h2 class="text-2xl text-center uppercase font-bold tracking-wide">{{ props.title }}</h2>
    </Header>
    <p v-if="props.headerError" class="text-text-error text-sm my-1">{{ props.headerError }}</p>
    <form class="flex-col pt-4" @submit.prevent="submit">
      <div v-for="item in props.schema" :key="item.id">
        <template v-if="item.type === 'submit'">
          <div class="flex justify-center">
            <Button type="submit">
              {{ item.placeholder }}
            </Button>
          </div>
        </template>
        <template v-else-if="item.type === 'link'">
          <div class="py-1">
            <router-link class="text-xs text-secondary underline" :to="item.to">{{ item.placeholder }}</router-link>
          </div>
        </template>
        <template v-else-if="item.type === 'file'">
          <RowBetween>
            <FileInput
              :clean="cleanInputs"
              v-bind="item"
              :label="item.placeholder"
              :inputLabel="FolderAddIcon"
              @change="handleChange"
            />
          </RowBetween>
        </template>
        <template v-else>
          <div class="flex flex-col">
            <Input v-bind="item" :wrapperClass="'w-full'" @keyup="handleChange" />
            <FormError :errors="props.validationErrors" :currentName="item.name" />
          </div>
        </template>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { InputHTMLAttributes, onMounted, ref } from 'vue'
import FormError from './FormError.vue'
import Input from '../../Form/Input.vue'
import Button from '../Buttons/Button.vue'
import FileInput from '../../Form/FileInput.vue'
import { FolderAddIcon } from '@heroicons/vue/outline'
import RowBetween from '../Spacing/RowBetween.vue'
import Header from '../Typography/Header.vue'

export interface FromSchema extends InputHTMLAttributes {
  name: string
  type: string
  id?: string
  required?: boolean
  min?: number
  max?: number
  placeholder: string
  to?: { name: string }
}

export interface ErrorData {
  [Property: string]: string[]
}

type Props = { schema: FromSchema[]; title?: string; validationErrors?: ErrorData[]; headerError?: string }
type Emits = { (e: 'submit', value: any): void }

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const formData = ref({})
const cleanInputs = ref(false)

const handleChange = (e: any) => {
  if (e.target.files && e.target.files.length) {
    formData.value = { ...formData.value, [e.target.name]: [...e.target.files] }
  } else {
    formData.value = { ...formData.value, [e.target.name]: e.target.value }
  }
}

const createKeys = () => {
  let data = {}
  for (const item of props.schema) {
    if (item.name === 'submit') continue
    //@ts-ignore
    data[item.name] = ''
  }

  return data
}

onMounted(() => {
  formData.value = createKeys()
  const firstInput = document.querySelector(`[name="${props.schema[0].name}"]`) as HTMLInputElement
  if (firstInput) firstInput.focus()
})

const submit = (e: any) => {
  emits('submit', formData.value)
  cleanInputs.value = !cleanInputs.value
  e.target.reset()
  formData.value = createKeys()
}
</script>
