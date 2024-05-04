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
    fontSize = 8,
    margin = 10,
    title,
    waterMarkLink
}: DataTablePdfOptions = {}) {
    const pdf = new jsPDF({ orientation });

    pdf.setFontSize(18);
    pdf.setTextColor(74, 84, 99)

    if (title) {
        pdf.text(title, margin, margin + 2)
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
                const dataUrl = await useHtmlToImage(header.component(item));
                mapping.set(`${i},${j}`, dataUrl);
            } else {
                value = header?.value ? getValue(item, header.value)?.toString() || '' : "";
            }

            _value.push(value);
        }

        _values.push(_value);
    }

    autoTable(pdf, {
        startY: title ? 16 : margin,
        theme: 'grid',
        styles: { overflow: "linebreak", fontSize, minCellHeight: 10 },
        headStyles: { valign: 'middle' },
        bodyStyles: { valign: 'middle' },
        head: [_headers],
        body: _values,
        margin: { top: margin, bottom: margin, left: margin, right: margin },
        didDrawCell: function (data) {
            if (data.section === 'body' && data.column.index > 0) {
                const key = `${data.row.index},${data.column.index - 1}`;
                const img = mapping.get(key);
                if (img) {
                    const textPos = data.cell.getTextPos();
                    const height = data.cell.height - data.cell.padding('vertical');

                    pdf.addImage(img.dataUrl, textPos.x, textPos.y - height / 2, img.aspectRadio * height, height)
                }
            }
        }
    });

    if (waterMarkLink) {
        var pageSize = pdf.internal.pageSize;
        var pageWidth = pageSize.width;
        var pageHeight = pageSize.height;

        const waterMarkLinkFontSize = waterMarkLink.fontSize || 18;
        const waterMarkLinkWidth = pdf.getStringUnitWidth(waterMarkLink.text) * waterMarkLinkFontSize / pdf.internal.scaleFactor;
        const waterMarkLinkX = pageWidth - waterMarkLinkWidth - margin;
        const waterMarkLinkY = pageHeight - margin;

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
