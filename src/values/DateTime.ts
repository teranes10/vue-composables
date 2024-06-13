import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc.js";
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(utc);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

type DateTimeFormat = "YYYY-MM-DDTHH:mm:ss" | 'h:mm:ss a, Do MMM YYYY' | (string & {});
type DateFormat = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'Do MMM YYYY' | "DD MMMM, YYYY" | (string & {});
type TimeFormat = 'HH:mm:ss' | 'h:mm:ss a' | (string & {});
type AnyDateFormat = DateTimeFormat | DateFormat | TimeFormat

export type DateOptions = {
    date?: string | number | Date,
    parseFormat?: AnyDateFormat,
    format?: AnyDateFormat,
    utc?: boolean,
    returnObject?: boolean
}

export function useDate(options?: DateOptions & { returnObject?: false }): string;
export function useDate(options?: DateOptions & { returnObject?: true }): Dayjs;
export function useDate({
    date,
    parseFormat,
    format = 'YYYY-MM-DDTHH:mm:ss',
    utc = false,
    returnObject = false
}: DateOptions = {}): string | Dayjs | undefined {
    if (date) {
        if (!useIsValidDate(date, parseFormat)) {
            return returnObject ? undefined : '';
        }
    }

    const time = utc ? dayjs.utc(date, parseFormat) : dayjs(date, parseFormat);

    if (returnObject) {
        return time;
    }

    return time.format(format);
}

export function useIsValidDate(date: string | number | Date, parseFormat?: string) {
    if (!date) {
        return false;
    }

    return dayjs(date, parseFormat).isValid();
}
