import { blobDownload } from '../blob/blobDownload'
import { jsonToCsv } from './jsonToCsv'

export interface JsonToCsvExportOptions {
  filename?: string
}

export function jsonToCsvExport<T extends any[]>(data: T, { filename = 'export.csv' }: JsonToCsvExportOptions = {}) {
  if (!document) {
    return
  }

  const csv = jsonToCsv(data)
  if (!csv) {
    return
  }

  const blob = new Blob([csv], { type: 'text/csv' })
  blobDownload(blob, { filename })
}
