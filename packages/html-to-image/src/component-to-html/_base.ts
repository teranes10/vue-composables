import { type Component, createVNode, render, shallowRef } from 'vue'
import { watchOnce } from '@teranes/vue-composables'
import { getShortUniqueId } from  '@teranes/short-unique-id'

export function getRenderContainer(): HTMLElement {
  if (!document) {
    throw new Error('document is undefined')
  }

  const container = document.createElement('div')
  container.id = `render-container-${getShortUniqueId(5)}`
  container.style.position = 'absolute'
  container.style.width = '1px'
  container.style.height = '1px'
  container.style.padding = '0'
  container.style.margin = '-1px'
  container.style.overflow = 'hidden'
  container.style.clip = 'rect(0, 0, 0, 0)'
  container.style.whiteSpace = 'nowrap'
  container.style.borderWidth = '0'

  document.body.append(container)
  return container
};

export interface RenderComponentOptions {
  debounceDelay?: number
}

export async function renderComponent(component: Component, { debounceDelay = 3 }: RenderComponentOptions = {}) {
  const container = getRenderContainer()
  const node = shallowRef(createVNode(component))
  render(node.value, container)

  const [newNode] = await watchOnce(node, { immediate: true, deep: true, debounceDelay })
  const el = newNode.el as HTMLElement

  setTimeout(() => {
    container?.remove()
  }, 10)

  return el
}
