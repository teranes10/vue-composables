import type { JsonToPdfOptions, JsonToPdfTableHeader } from './jsonToPdf'
import { jsonToPdf } from './jsonToPdf'

export interface JsonToPdfPrintOptions extends JsonToPdfOptions {
}

export async function jsonToPdfPrint(headers: JsonToPdfTableHeader[], items: any[], {
  title,
  orientation,
  fontSize,
  margin,
  waterMarkLink,
}: JsonToPdfPrintOptions = {}) {
  const pdf = await jsonToPdf(headers, items, { title, margin, orientation, fontSize, waterMarkLink })
  pdf.autoPrint()
  pdf.output('dataurlnewwindow')
}
