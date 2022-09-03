<template>
  <div class="w-full flex justify-center items-center pt-8 flex-col background-image">
    <Form title="Login" :schema="schema" @submit="submit" :headerError="errorMessage"></Form>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import Form from '../components/Form/Form.vue'
import useFetch from '../Hooks/useFetch'
import { UserType, useUser } from '../store/user'

interface LoginData {
  user?: UserType
  message?: string
}

const schema = [
  { type: 'text', name: 'username', id: 'user', required: true, placeholder: 'Enter your username or e-mail' },
  { type: 'password', name: 'password', id: 'password', required: true, placeholder: 'Enter your password' },
  { type: 'link', name: 'link', placeholder: 'Do not have account? Create here.', to: { name: 'Register' } },
  { type: 'submit', name: 'submit', id: 'submit', placeholder: 'Submit' },
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
      router.push(router.currentRoute.value.redirectedFrom || { name: 'Songs' })
    } else {
      errorMessage.value = 'Something wrong happend'
    }
  } else {
    errorMessage.value = res.response?.data?.message || 'Server problem, please try again leter'
  }
}
</script>
