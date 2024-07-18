import { toPng } from 'html-to-image'
import type { FunctionParams } from '../utils/FunctionParams'

type ToPngOptions = Omit<NonNullable<FunctionParams<typeof toPng>[1]>, 'style'>

export interface HtmlToImageOptions extends ToPngOptions {

}

export async function htmlToImage(el: HTMLElement, {
  skipFonts = true,
  cacheBust = true,
  quality = 1,
  pixelRatio = 1,
  ...options
}: HtmlToImageOptions = {}): Promise<string> {
  return await toPng(el, { skipFonts, cacheBust, quality, pixelRatio, ...options })
}
