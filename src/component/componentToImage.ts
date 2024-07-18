import type { Component } from 'vue'
import { htmlToImage } from '../html/htmlToImage'
import type { HtmlToImageOptions } from '../html/htmlToImage'
import { type ComponentToHtmlOptions, componentToHtml } from './componentToHtml'

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
