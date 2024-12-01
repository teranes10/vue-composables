import type { CSSProperties } from '@vue/runtime-dom'
import { type Component, defineComponent, h } from '@vue/runtime-core'
import type { RenderComponentOptions } from './_base'
import { renderComponent } from './_base'

export interface ComponentToHtmlOptions extends RenderComponentOptions {
  style?: Partial<CSSProperties | Record<string, string | number | undefined>>
}

export async function componentToHtml(component: Component, { style, debounceDelay }: Partial<ComponentToHtmlOptions> = {}) {
  const _component = defineComponent({
    setup() {
      return () => h('div', {
        style: {
          display: 'inline-flex',
          verticalAlign: 'top',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#ffffff',
          ...(style && style),
        },
      }, h(component))
    },
  })

  return await renderComponent(_component, { debounceDelay })
}
