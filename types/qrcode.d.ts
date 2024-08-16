declare module 'qrcode' {
  declare type QrCodeType = 'png' | 'svg'
  declare type QrCodeErrorCorrectionLevel = 'low' | 'medium' | 'quartile' | 'high'

  declare interface QrCodeOptions {
    type?: QrCodeType
    margin?: number
    width?: number
    errorCorrectionLevel?: QrCodeErrorCorrectionLevel
    color: {
      dark: string
      light: string
    }
  }

  declare function toDataURL(
    text: string,
    options: QrCodeOptions
  ): Promise<string>
}
