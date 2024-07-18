import type { Hex } from 'src/color/_base'
import type { PDF, PdfCoordinate } from './pdf'

export interface PdfTextOptions extends Partial<PdfCoordinate> {
  fontSize?: number
  color?: Hex
}

export function pdfAddText(pdf: PDF, text: string, { fontSize = 14, color = '#4A5463', ...coordinate }: PdfTextOptions = {}) {
  const { x, y } = pdf._getNewCoordinate(coordinate)

  pdf._setFontSize(fontSize)
  pdf._setTextColor(color)
  pdf.text(text, x, y + (fontSize / 2))

  pdf._setCoordinate((x + pdf.calculateTextWidth(text, fontSize)), (y + (fontSize / 2)), coordinate)
}
