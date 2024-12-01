import { onMounted, onUnmounted } from '@vue/runtime-core'
import { readonly, ref } from '@vue/reactivity'
import { debounce } from '@teranes/utils'

export function getScreenWidth() {
  const screenWidth = ref(0)

  const onResize = debounce(() => {
    screenWidth.value = window.innerWidth
  }, 10)

  onMounted(() => {
    if (window) {
      onResize()
      window.addEventListener('resize', onResize)
    }
  })

  onUnmounted(() => {
    if (window) {
      window.removeEventListener('resize', onResize)
    }
  })

  return readonly(screenWidth)
}
