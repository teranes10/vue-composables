import Papa from "papaparse";

export type ExportCsvOptions = {
    fileName?: string
}

export function useExportCsv(data: any[], { fileName = 'export.csv' }: ExportCsvOptions = {}) {
    const blob = new Blob([useJsonToCsv(data)], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', fileName);
    a.click()
}

export function useJsonToCsv(data: any[]) {
    return Papa.unparse(data);
}