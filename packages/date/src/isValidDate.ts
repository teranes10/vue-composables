import { dayjs } from './_base'

export function isValidDate(date: string | number | Date, parseFormat?: string) {
  if (!date) {
    return false
  }

  return dayjs(date, parseFormat).isValid()
}
