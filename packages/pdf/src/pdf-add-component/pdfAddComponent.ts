import type { Component } from '@vue/runtime-core'
import { type ComponentToHtmlOptions, componentToHtml } from '@teranes/html-to-image'
import { pdfAddHtml } from '../pdf-add-html/pdfAddHtml'
import type { PDF, PdfCoordinate } from '../pdf/pdf'
import type { PdfAddHtmlOptions } from '../pdf-add-html/pdfAddHtml'

export interface PdfAddComponentOptions extends ComponentToHtmlOptions, PdfAddHtmlOptions, Partial<PdfCoordinate> {

}

export async function pdfAddComponent(pdf: PDF, component: Component, { style, debounceDelay, ...options }: Partial<PdfAddComponentOptions> = {}) {
  const node = await componentToHtml(component, { debounceDelay, style })
  await pdfAddHtml(pdf, node, options)
}
