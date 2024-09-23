import jsPDF, { type jsPDFOptions } from 'jspdf'
import { type Hex, type RGB, hexToRgb } from '@teranes/utils'

export interface PdfOptions extends jsPDFOptions {
  fontSize?: number
  color?: Hex
  margin?: number
  dpi?: number
}

export interface PdfCoordinate {
  x: number
  y: number
  direction: 'vertical' | 'horizontal'
  trackCoordinates: boolean
}

interface PdfCoordinates extends PdfCoordinate {
  _x: number
  _y: number
}

export class PDF extends jsPDF {
  private fontSize: number
  private color: [number, number, number]
  private margin: number
  private dpi: number
  private coordinates: PdfCoordinates

  constructor({ fontSize = 10, color = '#000', margin = 15, dpi = 125, ...options }: PdfOptions = {}) {
    super({ orientation: 'landscape', format: 'a4', unit: 'px', ...options })

    this.fontSize = fontSize
    this.color = this._getRgbColor(color)
    this.margin = margin
    this.dpi = dpi

    this.setFontSize(this.fontSize)
    this.setTextColor(...this.color)
    this.coordinates = { x: this.margin, y: this.margin, _x: 0, _y: 0, direction: 'vertical', trackCoordinates: true }
  }

  _setFontSize = (fontSize: number) => {
    if (!fontSize) {
      return
    }
    this.fontSize = fontSize
    this.setFontSize(fontSize)
  }

  _setTextColor = (color: Hex) => {
    if (!color) {
      return
    }
    this.color = this._getRgbColor(color)
    this.setTextColor(...this.color)
  }

  _setCoordinate = (x: number, y: number, { direction = 'vertical' }: Partial<PdfCoordinate> = {}) => {
    this.coordinates.direction = direction
    if (direction === 'vertical') {
      this.coordinates._y = this.coordinates.y
      this.coordinates.y = y
    }
    else {
      this.coordinates._x = this.coordinates.x
      this.coordinates.x = x
    }
  }

  _getNewCoordinate = (coordinate: Partial<PdfCoordinate>) => {
    const { x = 0, y = 0, trackCoordinates = true } = coordinate
    const newX = (trackCoordinates ? this.getCoordinates().x : 0) + x
    const newY = (trackCoordinates ? this.getCoordinates().y : 0) + y
    return { x: newX, y: newY }
  }

  _getRgbColor = (color: Hex): [number, number, number] => {
    const _color: RGB = hexToRgb(color)
    return [_color.red, _color.green, _color.blue]
  }

  public pointsToPixels = (points: number) => points * this.dpi / 72

  public pixelsToPoints = (pixels: number) => pixels * 72 / this.dpi

  public getCoordinates = () => this.coordinates

  public getFontSize = () => this.fontSize

  public getMargin = () => this.margin

  public getMarginInPixels = () => this.pointsToPixels(this.margin)

  public getPageWidth = () => this.internal.pageSize.getWidth()

  public getPageWidthInPixels = () => this.pointsToPixels(this.getPageWidth())

  public getPageHeight = () => this.internal.pageSize.getHeight()

  public getPageHeightInPixels = () => this.pointsToPixels(this.getPageHeight())

  public calculateTextWidth = (text: string, fontSize: number) => this.getStringUnitWidth(text) * fontSize / this.internal.scaleFactor

  public print = () => {
    window.open(this.output('bloburl'))
  }

  public printOnCurrentWindow = () => {
    const pdfBlob = this.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)

    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = pdfUrl
    document.body.appendChild(iframe)

    iframe.onload = function () {
      iframe.contentWindow?.print()
    }
  }
}
