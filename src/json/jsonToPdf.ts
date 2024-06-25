import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { VNodeTypes } from 'vue'
import { componentToImage } from '../component/componentToImage'
import { getValueByObjectPath } from '../object/getValueByObjectPath'
import { isFunction } from '../function/isFunction'

export async function jsonToPdf(headers: JsonToPdfTableHeader[], items: any[], {
  orientation = 'landscape',
  fontSize = 14,
  margin = 15,
  title,
  waterMarkLink,
}: JsonToPdfOptions = {}): Promise<PdfObject> {
  const pdf = new JsPDF({ orientation, format: 'a4', unit: 'px', userUnit: 96 })
  const titleFontSize = 18
  const cellHeight = 25
  const cellPadding = 3.5

  if (title) {
    pdf.setFontSize(titleFontSize)
    pdf.setTextColor(74, 84, 99)
    pdf.text(title, margin, margin + titleFontSize / 2)
  }

  const _headers = ['#', ...headers.map(x => x.name)]
  const _values = []

  const mapping = new Map()

  for (let i = 0; i < items.length; i++) {
    const _value = [i + 1]
    const item = items[i]

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]
      let value: any = ''

      if (header?.component) {
        const dataUrl = await componentToImage(header.component(item), {
          style: {
            fontSize: `${fontSize}px`,
            display: 'inline-flex',
            alignItems: 'center',
            height: `${(cellHeight - (cellPadding * 2)) * 2}px`,
          },
        })
        mapping.set(`${i},${j}`, dataUrl)
      }
      else {
        value = header?.value ? getValue(item, header.value)?.toString() || '' : ''
      }

      _value.push(value)
    }

    _values.push(_value)
  }

  autoTable(pdf, {
    startY: title ? margin + titleFontSize : margin,
    theme: 'grid',
    styles: { overflow: 'linebreak', fontSize, minCellHeight: cellHeight, cellPadding: { vertical: cellPadding, horizontal: cellPadding } },
    headStyles: { valign: 'middle' },
    bodyStyles: { valign: 'middle' },
    head: [_headers],
    body: _values,
    margin: { vertical: margin, horizontal: margin },
    didDrawCell(data) {
      if (data.section === 'body' && data.column.index > 0) {
        const key = `${data.row.index},${data.column.index - 1}`
        const img = mapping.get(key)
        if (img) {
          const textPos = data.cell.getTextPos()
          const height = cellHeight - (cellPadding * 2)
          const width = img.aspectRadio * height

          pdf.addImage(img.dataUrl, textPos.x, textPos.y - height / 2, width, height)
        }
      }
    },
  })

  if (waterMarkLink) {
    const pageSize = pdf.internal.pageSize
    const pageWidth = pageSize.width
    const pageHeight = pageSize.height

    const waterMarkLinkFontSize = waterMarkLink.fontSize || 16
    const waterMarkLinkWidth = pdf.getStringUnitWidth(waterMarkLink.text) * waterMarkLinkFontSize / pdf.internal.scaleFactor
    const waterMarkLinkX = pageWidth - waterMarkLinkWidth - margin
    const waterMarkLinkY = pageHeight - margin

    pdf.setFontSize(waterMarkLinkFontSize)
    pdf.setTextColor(74, 84, 99)
    pdf.textWithLink(waterMarkLink.text, waterMarkLinkX, waterMarkLinkY, { url: waterMarkLink.url })
  }

  return pdf
}

function getValue(item: any, value: any) {
  if (isFunction(value)) {
    return value(item)
  }

  return getValueByObjectPath(item, value)
}

export interface PdfObject extends JsPDF { }

export interface JsonToPdfTableHeader<T = any> {
  name: string
  value?: string | ((item: T) => string)
  component?: (item: T) => VNodeTypes
}

export interface JsonToPdfOptions {
  title?: string
  orientation?: PdfOrientation
  fontSize?: number
  waterMarkLink?: PdfWaterMarkLink
  margin?: number
}

interface PdfWaterMarkLink {
  text: string
  url: string
  fontSize?: number
}

type PdfOrientation = 'portrait' | 'landscape'
