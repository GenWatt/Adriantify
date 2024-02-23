<template>
  <section class="mt-1 pb-1">
    <Input placeholder="Search" type="text" :id="id" :name="id" :icon="SearchCircleIcon" @keyup="handleChange" />
    <List @close="handleCloseList" v-if="showList && results && isList" class="rounded" :results="results" />
  </section>
</template>

<script lang="ts" setup>
import { SearchCircleIcon } from '@heroicons/vue/outline'
import axios from 'axios'
import { onMounted, ref, Ref } from 'vue'
import useAuthFetch from '../../../Hooks/useAuthFetch'
import useDebounce from '../../../Hooks/useDebounce'
import useUrl, { QueryData } from '../../../Hooks/useUrl'
import Input from '../../Form/Input.vue'
import List from '../../UI/List/List.vue'
import { v4 } from 'uuid'
import { PlaylistsAndSongs } from '../../../store/playlist'
import { useRouter } from 'vue-router'

interface Props {
  searchParams?: QueryData[]
  showList?: boolean
}

interface Emits {
  (e: 'results', results: any): void
  (e: 'loading', isLoading: boolean): void
}

const DEBOUNCE_TIME = 100

const { debounce } = useDebounce()
const { callApi } = useAuthFetch()
const { getQueryString } = useUrl()
const router = useRouter()

const searchText: Ref<string> = ref('')
const isList: Ref<boolean> = ref(true)
const results: Ref<PlaylistsAndSongs | null> = ref(null)
const { searchParams, showList } = defineProps<Props>()
const emits = defineEmits<Emits>()
const id = v4()

const handleCloseList = () => (isList.value = false)

const getSearchList = async () => {
  const params = [{ name: 'text', value: searchText.value }].concat(searchParams || [])
  if (searchText.value) {
    emits('loading', true)
    const res = await callApi<PlaylistsAndSongs>('GET', `/search/songs/${getQueryString(params)}`)

    if (axios.isAxiosError(res)) {
      emits('results', null)
    } else {
      results.value = res.data
      emits('results', results.value)
    }
    emits('loading', false)
  } else {
    results.value = null
    handleCloseList()
    emits('loading', false)
    emits('results', null)
  }
}

onMounted(() => router.afterEach(handleCloseList))

const handleChange = (e: any) => {
  isList.value = true
  searchText.value = e.target.value
  debounce(getSearchList, DEBOUNCE_TIME)
}
</script>
