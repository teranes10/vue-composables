import { getImageProperties } from '../image/getImageProperties'
import type { PDF, PdfCoordinate } from './pdf'

export interface PdfAddImageOptions extends Partial<PdfCoordinate> {

}

export async function pdfAddImage(pdf: PDF, src: string, { ...coordinate }: PdfAddImageOptions = {}) {
  const { x, y } = pdf._getNewCoordinate(coordinate)

  const img = await getImageProperties(src)
  const imgWidthInPt = pdf.pixelsToPoints(img.width)
  const imgHeightInPt = pdf.pixelsToPoints(img.height)
  pdf.addImage(img.src, 'PNG', x, y, imgWidthInPt, imgHeightInPt)

  let _y = y + imgHeightInPt
  let heightLeft = imgHeightInPt - (pdf.getPageHeight() - y)

  while (heightLeft >= 0) {
    const position = heightLeft - imgHeightInPt

    pdf.addPage()
    pdf.addImage(img.src, 'PNG', x, position, imgWidthInPt, imgHeightInPt)

    _y = heightLeft
    heightLeft -= pdf.getPageHeight()
  }

  pdf._setCoordinate((x + imgWidthInPt), _y, coordinate)
}
