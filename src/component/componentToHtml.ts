import type { CSSProperties, Component } from 'vue'
import { defineComponent, h } from 'vue'
import type { RenderComponentOptions } from './_base'
import { renderComponent } from './_base'

export interface ComponentToHtmlOptions extends RenderComponentOptions {
  style?: CSSProperties
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
