import { Ref, ref } from 'vue'

export interface ElementPosition {
  x: number
  y: number
  width: number
  height: number
}

const useBounding = () => {
  const element: Ref<HTMLElement | null> = ref(null)

  const getCoords = (): ElementPosition => {
    let rect: ElementPosition = { x: 0, y: 0, width: 0, height: 0 }

    if (element.value) {
      rect = element.value.getBoundingClientRect()
    }

    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  }

  const setStyle = (properties: any, value: string) => {
    if (element.value) {
      element.value.style[properties] = value
    }
  }

  const outOfBoundries = (coords2: ElementPosition) => {
    let isOutOfBoundries = false
    const coords = getCoords()

    if (coords) {
      if (
        coords.x < coords2.x + coords2.width &&
        coords.x + coords.width > coords2.x &&
        coords.y < coords2.y + coords2.height &&
        coords.height + coords.y > coords2.y
      ) {
        isOutOfBoundries = false
      } else {
        isOutOfBoundries = true
      }
    }

    return isOutOfBoundries
  }

  const setup = (el: HTMLElement) => {
    element.value = el
  }

  return { setup, getCoords, setStyle, outOfBoundries }
}

export default useBounding
