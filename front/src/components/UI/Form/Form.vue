<template>
  <div class="flex justify-center flex-col">
    <header v-if="props.title">
      <h2 class="text-2xl text-center uppercase font-bold tracking-wide">{{ props.title }}</h2>
    </header>
    <p v-if="props.headerError" class="text-text-error text-sm my-1">{{ props.headerError }}</p>
    <form class="flex-col pt-4" @submit.prevent="submit">
      <div v-for="item in props.schema" :key="item.id">
        <template v-if="item.type === 'submit'">
          <div class="flex justify-center">
            <button class="bg-secondary px-6 py-2 rounded-lg hover:bg-secondary/70" type="submit">
              {{ item.label }}
            </button>
          </div>
        </template>
        <template v-else-if="item.type === 'link'">
          <div class="py-1">
            <router-link class="text-xs text-secondary underline" :to="item.to">{{ item.label }}</router-link>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col">
            <label class="text-xs" :for="item.id">{{ item.label }}</label>
            <input
              class="bg-primary/40 border p-1 mt-1 mb-2"
              :type="item.type"
              :name="item.name"
              :minLength="item.min"
              :maxLength="item.max"
              :id="item.id"
              :required="item.required"
              v-model="formData[item.name]"
            />
            <FormError :errors="props.validationErrors" :currentName="item.name" />
          </div>
        </template>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import FormError from './FormError.vue'

export interface FromSchema {
  name: string
  type: string
  id?: string
  required?: boolean
  min?: number
  max?: number
  label: string
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

const createKeys = () => {
  let data = {}
  for (const item of props.schema) {
    if (item.name === 'submit') continue
    //@ts-ignore
    data[item.name] = null
  }

  return data
}

onMounted(() => {
  formData.value = createKeys()
  const firstInput = document.querySelector(`[name="${props.schema[0].name}"]`) as HTMLInputElement
  if (firstInput) firstInput.focus()
})

const submit = () => {
  emits('submit', formData.value)
  formData.value = createKeys()
}
</script>
