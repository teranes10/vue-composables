import type { Hex } from '@teranes/utils'
import type { PDF } from '../pdf/pdf'

export interface PdfWatermarkOptions {
  url?: string
  fontSize?: number
  color?: Hex
}

export function pdfAddWatermark(pdf: PDF, text: string, { fontSize = 14, color = '#4A5463', url }: PdfWatermarkOptions = {}) {
  pdf.setFontSize(fontSize)
  pdf.setTextColor(...pdf._getRgbColor(color))

  const pageSize = pdf.internal.pageSize
  const waterMarkLinkX = pageSize.width - pdf.calculateTextWidth(text, fontSize) - pdf.getMargin()
  const waterMarkLinkY = pageSize.height - pdf.getMargin()

  if (url) {
    pdf.textWithLink(text, waterMarkLinkX, waterMarkLinkY, { url })
  }
  else {
    pdf.text(text, waterMarkLinkX, waterMarkLinkY)
  }
}
