export default function useDebounce() {
  let timer: NodeJS.Timeout | null = null

  const debounce = (cb: () => void, timeout: number) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    timer = setTimeout(cb, timeout)
  }

  return { debounce }
}
