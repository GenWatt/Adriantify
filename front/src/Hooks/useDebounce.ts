export default function useDebounce() {
  const debounce = (cb: () => void, timeout: number) => {
    let timer: NodeJS.Timeout | null = null

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    timer = setTimeout(cb, timeout)
  }

  return { debounce }
}
