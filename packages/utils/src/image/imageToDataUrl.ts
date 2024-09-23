import { getImageProperties } from './getImageProperties'

export async function imageToDataUrl(src: string): Promise<string> {
  const imgProps = await getImageProperties(src)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get 2D context')
  }

  canvas.width = imgProps.width
  canvas.height = imgProps.height

  ctx.drawImage(imgProps.image, 0, 0)
  const dataUrl = canvas.toDataURL('image/png')

  canvas.remove()
  return dataUrl
}
