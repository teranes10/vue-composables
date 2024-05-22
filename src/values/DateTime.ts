import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc.js";
import advancedFormat from 'dayjs/plugin/advancedFormat.js';

dayjs.extend(utc);
dayjs.extend(advancedFormat);

type DateTimeFormat = "YYYY-MM-DDTHH:mm:ss" | 'h:mm:ss a, Do MMM YYYY' | (string & {});
type DateFormat = 'YYYY-MM-DD' | 'Do MMM YYYY' | "DD MMMM, YYYY" | (string & {});
type TimeFormat = 'HH:mm:ss' | 'h:mm:ss a' | (string & {});

export type DateOptions = {
    date?: string | number | Date,
    format?: DateTimeFormat | DateFormat | TimeFormat,
    utc?: boolean,
    returnObject?: boolean
}

export function useDate(options?: DateOptions & { returnObject?: false }): string;
export function useDate(options?: DateOptions & { returnObject?: true }): Dayjs;
export function useDate({
    date,
    format = 'YYYY-MM-DDTHH:mm:ss',
    utc = false,
    returnObject = false
}: DateOptions = {}): string | Dayjs | undefined {
    if (date) {
        if (!useIsValidDate(date)) {
            return returnObject ? undefined : '';
        }
    }

    const time = utc ? dayjs.utc(date) : dayjs(date);

    if (returnObject) {
        time;
    }

    return time.format(format);
}

export function useIsValidDate(date: string | number | Date) {
    if (!date) {
        return false;
    }

    return dayjs(date).isValid();
}
