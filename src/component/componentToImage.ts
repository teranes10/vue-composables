import { toPng } from 'html-to-image'
import { debounce } from 'lodash-es'
import type { VNodeTypes } from 'vue'
import { createVNode, defineComponent, h, render, shallowRef, watch } from 'vue'

export function componentToImage(component: VNodeTypes, {
  background = '#ffffff',
  skipFonts = true,
  cacheBust = true,
  delay = 1,
  style,
}: ComponentToImageOptions = {}): Promise<Image> {
  return new Promise((resolve, reject) => {
    try {
      const vNode = defineComponent({
        setup() {
          const contentEl = shallowRef()

          watch(contentEl, debounce(async () => {
            try {
              if (!contentEl.value) {
                return
              }

              const dataUrl = await toPng(contentEl.value, { skipFonts, cacheBust })

              const img = new Image()
              img.onload = () => {
                resolve({
                  dataUrl,
                  width: img.width,
                  height: img.height,
                  aspectRadio: img.width / img.height,
                })
              }
              img.src = dataUrl

              contentEl.value.remove()
            }
            catch (error) {
              reject(error)
            }
          }, delay))

          return () => h('div', {
            ref: contentEl,
            style: {
              display: 'inline-flex',
              background,
              ...(style && style),
            },
          }, h(component as any))
        },
      })

      const node = createVNode(vNode)
      const container = getContainer()
      if (node && container) {
        render(node, container)
      }
    }
    catch (error) {
      reject(error)
    }
  })
}

export interface ComponentToImageOptions {
  background?: string
  skipFonts?: boolean
  cacheBust?: boolean
  delay?: number
  style?: Partial<CSSStyleDeclaration>
}

interface Image {
  dataUrl: string
  width: number
  height: number
  aspectRadio: number
}

function getContainer(): HTMLElement | undefined {
  if (!document) {
    return
  }

  let container = document.getElementById('renderer-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'renderer-container'
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
  }

  return container
};
