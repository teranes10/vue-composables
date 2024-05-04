import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { VNodeTypes } from "vue";
import { useObjectValueByPath } from "../values/Object";
import { useHtmlToImage } from "./Image";

export type PdfOrientation = 'portrait' | 'landscape';

export type PdfWaterMarkLink = {
    text: string,
    url: string,
    fontSize?: number
}

export type DataTablePdfOptions = {
    title?: string
    orientation?: PdfOrientation,
    fontSize?: number,
    waterMarkLink?: PdfWaterMarkLink,
    margin?: number
}

export type PdfTableHeader<T = any> = {
    name: string;
    value?: string | ((item: T) => string);
    component?: (item: T) => VNodeTypes;
};

const getValue = (item: any, value: any) => {
    if (typeof value === 'function') {
        return value(item);
    }

    return useObjectValueByPath(item, value)
}

async function dataTablePdf(headers: PdfTableHeader[], items: any[], {
    orientation = 'landscape',
    fontSize = 14,
    margin = 15,
    title,
    waterMarkLink
}: DataTablePdfOptions = {}) {
    const pdf = new jsPDF({ orientation, format: 'a4', unit: 'px', userUnit: 96 });
    const titleFontSize = 18;
    const cellHeight = 25;
    const cellPadding = 3.5;

    if (title) {
        pdf.setFontSize(titleFontSize);
        pdf.setTextColor(74, 84, 99)
        pdf.text(title, margin, margin + titleFontSize / 2)
    }

    const _headers = ['#', ...headers.map(x => x.name)];
    const _values = [];

    const mapping = new Map();

    for (let i = 0; i < items.length; i++) {
        const _value = [i + 1];
        const item = items[i];

        for (let j = 0; j < headers.length; j++) {
            const header = headers[j]
            let value: any = '';

            if (header?.component) {
                const dataUrl = await useHtmlToImage(header.component(item), {
                    style: {
                        fontSize: `${fontSize}px`,
                        display: "inline-flex",
                        alignItems: "center",
                        height: `${(cellHeight - (cellPadding * 2)) * 2}px`
                    }
                });
                mapping.set(`${i},${j}`, dataUrl);
            } else {
                value = header?.value ? getValue(item, header.value)?.toString() || '' : "";
            }

            _value.push(value);
        }

        _values.push(_value);
    }

    autoTable(pdf, {
        startY: title ? margin + titleFontSize : margin,
        theme: 'grid',
        styles: { overflow: "linebreak", fontSize, minCellHeight: cellHeight, cellPadding: { vertical: cellPadding, horizontal: cellPadding } },
        headStyles: { valign: 'middle' },
        bodyStyles: { valign: 'middle' },
        head: [_headers],
        body: _values,
        margin: { vertical: margin, horizontal: margin },
        didDrawCell: function (data) {
            if (data.section === 'body' && data.column.index > 0) {
                const key = `${data.row.index},${data.column.index - 1}`;
                const img = mapping.get(key);
                if (img) {
                    const textPos = data.cell.getTextPos();
                    const height = cellHeight - (cellPadding * 2);
                    const width = img.aspectRadio * height;

                    pdf.addImage(img.dataUrl, textPos.x, textPos.y - height / 2, width, height)
                }
            }
        }
    });

    if (waterMarkLink) {
        const pageSize = pdf.internal.pageSize;
        const pageWidth = pageSize.width;
        const pageHeight = pageSize.height;

        const waterMarkLinkFontSize = waterMarkLink.fontSize || 16;
        const waterMarkLinkWidth = pdf.getStringUnitWidth(waterMarkLink.text) * waterMarkLinkFontSize / pdf.internal.scaleFactor;
        const waterMarkLinkX = pageWidth - waterMarkLinkWidth - margin;
        const waterMarkLinkY = pageHeight - margin;

        pdf.setFontSize(waterMarkLinkFontSize);
        pdf.setTextColor(74, 84, 99)
        pdf.textWithLink(waterMarkLink.text, waterMarkLinkX, waterMarkLinkY, { url: waterMarkLink.url });
    }

    return pdf;
}

export type ExportPdfOptions = DataTablePdfOptions & {
    fileName?: string,
}

export async function useExportDataTablePdf(headers: PdfTableHeader[], items: any[], {
    fileName = "export.pdf",
    title,
    orientation,
    fontSize,
    margin,
    waterMarkLink
}: ExportPdfOptions = {}) {
    const pdf = await dataTablePdf(headers, items, { title, margin, orientation, fontSize, waterMarkLink })
    pdf.save(fileName);
}


export type ExportPrintOptions = DataTablePdfOptions & {
}

export async function useExportDataTablePrint(headers: PdfTableHeader[], items: any[], {
    title,
    orientation,
    fontSize,
    margin,
    waterMarkLink
}: ExportPrintOptions = {}) {
    const pdf = await dataTablePdf(headers, items, { title, margin, orientation, fontSize, waterMarkLink })
    pdf.autoPrint();
    pdf.output('dataurlnewwindow');
}
