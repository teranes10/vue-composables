export function getImageProperties(src: string): Promise<ImageProperties> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const props: ImageProperties = {
        src,
        image: img,
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        newWidth(height: number) {
          return height * this.aspectRatio
        },
        newHeight(width: number) {
          return width / this.aspectRatio
        },
      }

      resolve(props)
    }

    img.onerror = () => {
      reject(new Error('Unable to load the image.'))
    }

    img.src = src
  })
}

export interface ImageProperties {
  image: HTMLImageElement
  src: string
  width: number
  height: number
  aspectRatio: number
  newWidth: (height: number) => number
  newHeight: (width: number) => number
}
