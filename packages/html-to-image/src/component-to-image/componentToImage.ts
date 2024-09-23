import type { Component } from 'vue'
import { htmlToImage, type HtmlToImageOptions } from '../html-to-image/htmlToImage'
import { type ComponentToHtmlOptions, componentToHtml } from '../component-to-html/componentToHtml'

export interface ComponentToImageOptions extends ComponentToHtmlOptions, HtmlToImageOptions {

}

export async function componentToImage(component: Component, {
  skipFonts = true,
  cacheBust = true,
  quality = 1,
  pixelRatio = 1,
  debounceDelay = 5,
  style,
}: ComponentToImageOptions = {}): Promise<string> {
  const node = await componentToHtml(component, { style, debounceDelay })
  return await htmlToImage(node, { skipFonts, cacheBust, quality, pixelRatio })
}
