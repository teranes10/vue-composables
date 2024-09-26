import utc from 'dayjs/plugin/utc.js'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import dayjs from 'dayjs'
import { Dayjs } from '../dayjs'

dayjs.extend(utc)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)

export { dayjs, type Dayjs }

export type DateTimeFormat = 'YYYY-MM-DDTHH:mm:ss' | 'h:mm:ss a, Do MMM YYYY' | (NonNullable<unknown> & string)
export type DateFormat = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'Do MMM YYYY' | 'DD MMMM, YYYY' | (NonNullable<unknown> & string)
export type TimeFormat = 'HH:mm:ss' | 'h:mm:ss a' | (NonNullable<unknown> & string)
export type AnyDateFormat = DateTimeFormat | DateFormat | TimeFormat
