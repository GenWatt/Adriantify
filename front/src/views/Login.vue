<template>
  <div class="w-full flex justify-center items-center pt-8 flex-col">
    <Form title="Login" :schema="schema" @submit="submit" :headerError="errorMessage"></Form>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import Form from '../components/UI/Form/Form.vue'
import useFetch from '../Hooks/useFetch'
import { UserType, useUser } from '../store/user'

interface LoginData {
  user?: UserType
  message?: string
}

const schema = [
  { type: 'text', name: 'username', id: 'user', required: true, label: 'Enter your username or e-mail' },
  { type: 'password', name: 'password', id: 'password', required: true, label: 'Enter your password' },
  { type: 'link', name: 'link', label: 'Do not have account? Create here.', to: { name: 'Register' } },
  { type: 'submit', name: 'submit', id: 'submit', label: 'Submit' },
]
const { callApi } = useFetch()
const router = useRouter()
const errorMessage: Ref<string> = ref('')
const user = useUser()

const submit = async (data: any) => {
  const res = await callApi<LoginData>('POST', '/login', { data })

  if (!axios.isAxiosError(res)) {
    if (res.data.user) {
      user.addUser(res.data.user)
      router.push({ name: 'Songs' })
    } else {
      errorMessage.value = 'Something wrong happend'
    }
  } else {
    errorMessage.value = res.response?.data?.message || 'Server problem, please try again leter'
  }
}
</script>
