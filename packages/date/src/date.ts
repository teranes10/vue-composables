import { type AnyDateFormat, type Dayjs, dayjs } from './_base'
import { isValidDate } from './isValidDate'

export interface DateObject extends Dayjs {}

export interface DateOptions {
  date?: string | number | Date
  parseFormat?: AnyDateFormat
  format?: AnyDateFormat
  utc?: boolean
  returnObject?: boolean
}

export function date(options?: DateOptions & { returnObject?: false }): string
export function date(options?: DateOptions & { returnObject?: true }): DateObject
export function date(options: DateOptions = {}): string | DateObject | undefined {
  const {
    date,
    parseFormat,
    format = 'YYYY-MM-DDTHH:mm:ss',
    utc = false,
    returnObject = false,
  } = options

  if (date) {
    if (!isValidDate(date, parseFormat)) {
      return returnObject ? undefined : ''
    }
  }

  const time = utc ? dayjs.utc(date, parseFormat) : dayjs(date, parseFormat)

  if (returnObject) {
    return time
  }

  return time.format(format)
}
