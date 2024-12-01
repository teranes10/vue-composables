import { toNumber } from '@teranes/utils'
import type { PDF, PdfCoordinate } from '../pdf/pdf'

export interface PdfAddHtmlOptions extends Partial<PdfCoordinate> {
  width: number
  scale: number
}

export function pdfAddHtml(pdf: PDF, node: HTMLElement, options: Partial<PdfAddHtmlOptions> = {}) {
  const {
    width = pdf.getPageWidth() - (pdf.getMargin() * 2),
    scale = 1,
    ...coordinate
  } = options
  const { x, y } = pdf._getNewCoordinate(coordinate)

  return new Promise<void>((resolve, reject) => {
    const worker = pdf.html(node, {
      x,
      y,
      width,
      windowWidth: pdf.pointsToPixels(width) * scale,
    })

    worker.then(() => {
      const heightStr = (worker as any)?.prop?.container?.height
      const heightInPx = toNumber(heightStr)
      const heightInPt = pdf.pixelsToPoints(heightInPx)

      let newY = y + heightInPt
      if (newY > pdf.getPageHeight()) {
        const remaining = pdf.getPageHeight() - newY
        newY = Math.abs(remaining % pdf.getPageHeight())
      }

      pdf._setCoordinate(x + width, newY, coordinate)
      resolve()
    })
      .catch((error: any) => {
        reject(error)
      })
  })
}
