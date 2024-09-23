import type { Component } from 'vue'
import { pdfAddHtml } from './pdfAddHtml'
import { type ComponentToHtmlOptions, componentToHtml } from '@teranes/html-to-image'
import type { PDF, PdfCoordinate } from './pdf'
import type { PdfAddHtmlOptions } from './pdfAddHtml'

export interface PdfAddComponentOptions extends ComponentToHtmlOptions, PdfAddHtmlOptions, Partial<PdfCoordinate> {

}

export async function pdfAddComponent(pdf: PDF, component: Component, { style, debounceDelay, ...options }: Partial<PdfAddComponentOptions> = {}) {
  const node = await componentToHtml(component, { debounceDelay, style })
  await pdfAddHtml(pdf, node, options)
}
