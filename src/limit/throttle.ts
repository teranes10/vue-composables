export function throttle(callback: () => void, delay: number = 50) {
  let isDisabled = false

  return () => {
    if (!isDisabled) {
      isDisabled = true

      callback()

      setTimeout(() => {
        isDisabled = false
      }, delay)
    }
  }
}
