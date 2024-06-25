export interface BlobDownloadOptions {
  filename: string
}

export function blobDownload(blob: Blob, { filename }: BlobDownloadOptions) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('download', filename)
  a.click()
}
