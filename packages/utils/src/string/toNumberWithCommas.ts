export function toNumberWithCommas(value: string): string {
  return value?.replace(/\D/g, '')?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || ''
}
