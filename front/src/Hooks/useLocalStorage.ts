export default function useLocalStorage() {
  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value)
  }

  const setItems = (data: { [Property: string]: string }[]) => {
    for (const item of data) {
      const key = Object.keys(item)
      const value = Object.values(item)
      for (let i = 0; i < key.length; i++) {
        localStorage.setItem(key[i], value[i])
      }
    }
  }

  const getItem = (key: string) => {
    return localStorage.getItem(key)
  }

  const removeItem = (key: string) => {
    localStorage.removeItem(key)
  }

  return { removeItem, setItem, getItem, setItems }
}
