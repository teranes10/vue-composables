import { onUnmounted } from '@vue/runtime-core'
import { throttle } from '@teranes/utils'

export function infiniteScroll(
  containerEl: HTMLElement,
  visibleItems: number,
  callback: () => void,
) {
  const observer = new MutationObserver(
    throttle(() => {
      if (containerEl.children.length > visibleItems) {
        let height = 0
        for (let i = 0; i < visibleItems; i++) {
          height += containerEl.children[i].clientHeight
        }

        containerEl.style.maxHeight = `${height}px`
      }
    }, 50),
  )

  const scrollListener = (e: Event) => {
    const el = e.target as HTMLElement
    if (el.offsetHeight + el.scrollTop >= el.scrollHeight) {
      callback()
    }
  }

  observer.observe(containerEl, { childList: true })
  containerEl.addEventListener('scroll', scrollListener)

  onUnmounted(() => {
    observer.disconnect()
    containerEl.removeEventListener('scroll', scrollListener)
  })
}
