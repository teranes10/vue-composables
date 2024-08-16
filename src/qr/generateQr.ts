import QRCode from 'qrcode'

export type QrCodeType = 'png' | 'svg'
export type QrCodeErrorCorrectionLevel = 'low' | 'medium' | 'quartile' | 'high'

export interface QrCodeOptions {
  type?: QrCodeType
  margin?: number
  width?: number
  errorCorrectionLevel?: QrCodeErrorCorrectionLevel
  colorLight?: string
  colorDark?: string
}

export async function generateQrCode(value: string, {
  type = 'svg',
  margin = 1,
  width = 250,
  errorCorrectionLevel = 'medium',
  colorLight = '#ffffffff',
  colorDark = '#000000ff',
}: QrCodeOptions = {}) {
  const dataUrl = QRCode.toDataURL(value, {
    type,
    margin,
    width,
    errorCorrectionLevel,
    color: {
      dark: colorDark,
      light: colorLight,
    },
  })

  return dataUrl
}
