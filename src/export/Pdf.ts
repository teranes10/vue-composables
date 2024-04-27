import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type PdfOrientation = 'portrait' | 'landscape';

export type PdfWaterMarkLink = {
    text: string,
    url: string,
    fontSize?: number
}

export type DataTablePdfOptions = {
    orientation?: PdfOrientation,
    fontSize?: number,
    waterMarkLink?: PdfWaterMarkLink
}

function dataTablePdf(headers: string[], values: string[][], {
    orientation = 'landscape',
    fontSize = 8,
    waterMarkLink = undefined
}: DataTablePdfOptions = {}) {
    const pdf = new jsPDF({ orientation });

    var pageSize = pdf.internal.pageSize;
    var pageWidth = pageSize.width;
    var pageHeight = pageSize.height;

    autoTable(pdf, {
        styles: { overflow: "linebreak", fontSize },
        head: [headers],
        body: values
    });

    if (waterMarkLink) {
        const waterMarkLinkFontSize = waterMarkLink.fontSize || 16;
        const waterMarkLinkWidth = pdf.getStringUnitWidth(waterMarkLink.text) * waterMarkLinkFontSize / pdf.internal.scaleFactor;
        const waterMarkLinkX = pageWidth - waterMarkLinkWidth - 5;
        const waterMarkLinkY = pageHeight - 5;

        pdf.textWithLink(waterMarkLink.text, waterMarkLinkX, waterMarkLinkY, { url: waterMarkLink.url });
    }

    return pdf;
}

export type ExportPdfOptions = DataTablePdfOptions & {
    fileName?: string,
}

export function useExportDataTablePdf(headers: string[], values: string[][], {
    orientation = 'landscape',
    fileName = "export.pdf",
    fontSize = 8,
    waterMarkLink = undefined
}: ExportPdfOptions = {}) {
    const pdf = dataTablePdf(headers, values, { orientation, fontSize, waterMarkLink })
    pdf.save(fileName);
}


export type ExportPrintOptions = DataTablePdfOptions & {
}

export function useExportDataTablePrint(headers: string[], values: string[][], {
    orientation = 'landscape',
    fontSize = 8,
    waterMarkLink = undefined
}: ExportPrintOptions = {}) {
    const pdf = dataTablePdf(headers, values, { orientation, fontSize, waterMarkLink })
    pdf.autoPrint();
    pdf.output('dataurlnewwindow');
}