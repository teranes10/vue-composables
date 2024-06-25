import type { JsonToPdfOptions, JsonToPdfTableHeader } from './jsonToPdf'
import { jsonToPdf } from './jsonToPdf'

export interface JsonToPdfExportOptions extends JsonToPdfOptions {
  fileName?: string
}

export async function jsonToPdfExport<T>(headers: JsonToPdfTableHeader[], items: T[], {
  fileName = 'export.pdf',
  title,
  orientation,
  fontSize,
  margin,
  waterMarkLink,
}: JsonToPdfExportOptions = {}) {
  const pdf = await jsonToPdf(headers, items, { title, margin, orientation, fontSize, waterMarkLink })
  pdf.save(fileName)
}
