import { ref, Ref } from 'vue'

export default function useScroll(element: Ref<HTMLElement | null>) {
  const margin = ref(100)

  const isBottomOfPage = () => {
    if (!element.value) return false
    return element.value.scrollTop + element.value.offsetHeight + margin.value >= element.value.scrollHeight
      ? true
      : false
  }

  const setMargin = (newMargin: number) => (margin.value = newMargin)

  return { isBottomOfPage, setMargin }
}
