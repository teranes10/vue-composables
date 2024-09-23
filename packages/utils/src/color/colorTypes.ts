export type Hex = `#${string}`

export interface RGB {
    red: number
    green: number
    blue: number
}

export interface HSL {
    hue: number
    saturation: number
    lightness: number
}

export type CssFilter =
    `invert(${number}%) sepia(${number}%) saturate(${number}%) hue-rotate(${number}deg) brightness(${number}%) contrast(${number}%);`