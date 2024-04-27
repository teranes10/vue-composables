import Papa from "papaparse";

export function useExportCsv(data: any[]) {
    Papa.unparse(data);
}