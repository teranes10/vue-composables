import autoTable, { type CellHookData, type Styles } from 'jspdf-autotable'
import type { Component } from 'vue'
import { executeInBatches } from '@teranes/utils'
import { isFunction } from '@teranes/utils'
import { getValueByObjectPath } from '@teranes/utils'
import { componentToImage } from '@teranes/html-to-image'
import { getImageProperties } from '@teranes/utils'
import { round } from '@teranes/utils'
import type { PDF, PdfCoordinate } from './pdf'

export interface PdfTableHeader<T> {
  text: string
  value?: string | ((item: T) => string)
  component?: (item: T) => Component
  styles?: Partial<Styles>
}

export interface PdfDrawItemOptions<T> {
  header: PdfTableHeader<T>
  item: T
  headerIndex: number
  itemIndex: number
  coordinate: { x: number, y: number }
  width: number
  height: number
  minHeight: number
  internal: CellHookData
}

export interface PdfAddTableOptions<T> extends Partial<PdfCoordinate> {
  width?: number
  fontSize: number
  minCellHeight: number
  cellPaddingVertical: number
  cellPaddingHorizontal: number
  showLineNumber: boolean
  didDrawItem?: ((options: PdfDrawItemOptions<T>) => void)
  progress?: (percentage: number) => void
}

const defaultValues: PdfAddTableOptions<any> = {
  showLineNumber: true,
  minCellHeight: 25,
  cellPaddingVertical: 5,
  cellPaddingHorizontal: 5,
  fontSize: 10,
}

export async function pdfAddTable<T>(pdf: PDF, headers: PdfTableHeader<T>[], items: T[], options: Partial<PdfAddTableOptions<T>> = {}) {
  const _options = { ...defaultValues, width: pdf.getPageWidth() - (pdf.getMargin() * 2), ...options }
  const { width, showLineNumber, minCellHeight, cellPaddingVertical, cellPaddingHorizontal, fontSize, didDrawItem, ...coordinate } = _options
  const { x, y } = pdf._getNewCoordinate(coordinate)

  const { componentMappings, columnStyles } = await processComponents(pdf, headers, items, _options)

  const _headers = [...(showLineNumber ? ['#'] : []), ...headers.map(header => header.text)]
  const _values = items.map((item, i) => [...(showLineNumber ? [i + 1] : []), ...headers.map(header => getValue(item, header.value))])

  const _autoTable: typeof autoTable = typeof autoTable === 'function' ? autoTable : (autoTable as any).default

  _autoTable(pdf, {
    startY: y,
    margin: { left: x },
    tableWidth: width,
    theme: 'grid',
    styles: { overflow: 'linebreak', fontSize, minCellHeight, cellPadding: { vertical: cellPaddingVertical, horizontal: cellPaddingHorizontal } },
    headStyles: { valign: 'middle' },
    bodyStyles: { valign: 'middle' },
    head: [_headers],
    body: _values,
    columnStyles,
    didDrawCell(data) {
      if (data.section === 'body' && data.column.index > 0) {
        const options = getDrawItemOptions(headers, items, data, _options)
        const key = `${options.itemIndex},${options.headerIndex}`

        const addImage = componentMappings.get(key)
        if (addImage) {
          addImage(options.coordinate.x, options.coordinate.y)
        }

        if (isFunction(didDrawItem)) {
          didDrawItem(options)
        }
      }
    },
  })

  const finalY = (pdf as any)?.lastAutoTable?.finalY
  const finalX = x + width

  if (coordinate.trackCoordinates) {
    pdf._setCoordinate(finalX, finalY, coordinate)
  }
}

async function processComponents<T>(pdf: PDF, headers: PdfTableHeader<T>[], items: T[], options: PdfAddTableOptions<T>) {
  const { progress, showLineNumber, minCellHeight, cellPaddingHorizontal, cellPaddingVertical, fontSize } = options

  const componentMappings = new Map<string, any>()
  const columnStyles = headers.reduce((styles: Record<number, Partial<Styles>>, header, i) => {
    if (header.styles) {
      styles[showLineNumber ? (i + 1) : i] = header.styles
    }
    return styles
  }, {})

  let totalRenderedComponents = 0
  const totalComponentsToRender = headers.filter(header => header.component).length * items.length

  async function processComponent(component: Component, key: string, headerIndex: number) {
    try {
      const heightInPt = minCellHeight - cellPaddingVertical
      const heightInPx = pdf.pointsToPixels(heightInPt)

      const dataUrl = await componentToImage(component, {
        style: {
          fontSize: `${fontSize}px`,
          height: `${heightInPx}px`,
        },
      })

      const img = await getImageProperties(dataUrl)
      const widthInPt = pdf.pixelsToPoints(img.width)
      const cellWidthInPt = widthInPt + cellPaddingHorizontal

      const _headerIndex = showLineNumber ? (headerIndex + 1) : headerIndex
      columnStyles[_headerIndex] ??= { cellWidth: cellWidthInPt }
      columnStyles[_headerIndex].cellWidth ??= cellWidthInPt

      if (typeof columnStyles[_headerIndex].cellWidth === 'number' && columnStyles[_headerIndex].cellWidth < cellWidthInPt) {
        columnStyles[_headerIndex].cellWidth = cellWidthInPt
      }

      const addImage = (x: number, y: number) => {
        pdf.addImage(img.src, x, y - (heightInPt / 2), widthInPt, heightInPt)
      }

      componentMappings.set(key, addImage)
    }
    catch (error) {
      componentMappings.set(key, () => {})
    }

    totalRenderedComponents++
    const percentage = (totalRenderedComponents / totalComponentsToRender) * 100
    progress?.(Math.min(100, round(percentage)))
  }

  items.forEach((item, i) => headers.forEach((header, j) => {
    if (header.component) {
      const key = `${i},${j}`
      const component = header.component(item)
      const promise = () => processComponent(component, key, j)
      componentMappings.set(key, promise)
    }
  }))

  await executeInBatches(Array.from(componentMappings.values()))
  return { componentMappings, columnStyles }
}

function getDrawItemOptions<T>(headers: PdfTableHeader<T>[], items: T[], data: CellHookData, options: PdfAddTableOptions<T>): PdfDrawItemOptions<T> {
  const { showLineNumber, minCellHeight } = options

  const itemIndex = data.row.index
  const item = items[itemIndex]
  const headerIndex = data.column.index - (showLineNumber ? 1 : 0)
  const header = headers[headerIndex]
  const textPos = data.cell.getTextPos()

  return {
    itemIndex,
    item,
    headerIndex,
    header,
    coordinate: {
      x: textPos.x,
      y: textPos.y,
    },
    minHeight: minCellHeight,
    height: data.cell.height,
    width: data.cell.width,
    internal: data,
  }
}

function getValue(item: any, value: any) {
  if (!value) {
    return ''
  }

  if (isFunction(value)) {
    return value(item)
  }

  return getValueByObjectPath(item, value)
}
