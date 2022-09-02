<template>
  <div class="w-full flex justify-center items-center pt-8">
    <Form title="Register" :schema="schema" @submit="submit" :validationErrors="errors" />
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import Form, { ErrorData } from '../components/UI/Form/Form.vue'
import useFetch from '../Hooks/useFetch'

interface RegisterData {
  validateErrors?: []
  messsage?: string
}

const schema = [
  { type: 'text', name: 'username', id: 'user', required: true, min: 3, max: 15, placeholder: 'Enter your username' },
  { type: 'email', name: 'email', id: 'email', required: true, min: 3, max: 32, placeholder: 'Enter your email' },
  {
    type: 'password',
    name: 'password',
    id: 'password',
    required: true,
    min: 3,
    max: 20,
    placeholder: 'Enter your password',
  },
  { type: 'link', name: 'link', placeholder: 'Already have an account? Lets go login.', to: { name: 'Login' } },
  { type: 'submit', name: 'submit', id: 'submit', placeholder: 'Submit' },
]
const { callApi } = useFetch()
const router = useRouter()
const errors: Ref<ErrorData[]> = ref([])

const submit = async (data: any) => {
  const res = await callApi<RegisterData>('POST', '/register', { data })

  if (!axios.isAxiosError(res)) {
    router.push({ name: 'Login' })
  } else {
    errors.value = res.response?.data.validateErrors || []
  }
}
</script>
