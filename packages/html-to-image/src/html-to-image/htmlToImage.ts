import { toPng } from 'html-to-image'

type Params<T> = T extends (...args: infer P) => any ? P : never
type ToPngOptions = Omit<NonNullable<Params<typeof toPng>[1]>, 'style'>

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
