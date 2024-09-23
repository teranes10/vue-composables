import { CssFilter, Hex, HSL, RGB } from "./colorTypes"

export class CssFilterReSolver {
  private rgb: RGB
  private hsl: HSL

  private constructor(color: Color) {
    this.rgb = color.toRGB()
    this.hsl = color.toHSL()
  }

  public static from(color: Color) {
    return new CssFilterReSolver(color)
  }

  public solve(): CssFilter {
    const result = this.solveNarrow(this.solveWide())
    return this.css(result.values)
  }

  private solveWide(): Wide {
    const A = 5
    const c = 15
    const a = [60, 180, 18000, 600, 1.2, 1.2]

    let best: Wide = { loss: Infinity, values: [] }
    for (let i = 0; best.loss > 25 && i < 3; i++) {
      const initial = [50, 20, 3750, 50, 100, 100]
      const result = this.spsa(A, a, c, initial, 1000)
      if (result.loss < best.loss) {
        best = result
      }
    }
    return best
  }

  private solveNarrow(wide: Wide): Wide {
    const A = wide.loss
    const c = 2
    const A1 = A + 1
    const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1]
    return this.spsa(A, a, c, wide.values, 500)
  }

  private spsa(
    A: number,
    a: number[],
    c: number,
    values: number[],
    iters: number,
  ): Wide {
    const alpha = 1
    const gamma = 0.16666666666666666

    let best: number[] = []
    let bestLoss = Infinity
    const deltas: number[] = Array.from({ length: 6 })
    const highArgs: number[] = Array.from({ length: 6 })
    const lowArgs: number[] = Array.from({ length: 6 })

    for (let k = 0; k < iters; k++) {
      const ck = c / (k + 1) ** gamma
      for (let i = 0; i < 6; i++) {
        deltas[i] = Math.random() > 0.5 ? 1 : -1
        highArgs[i] = values[i] + ck * deltas[i]
        lowArgs[i] = values[i] - ck * deltas[i]
      }

      const lossDiff = this.loss(highArgs) - this.loss(lowArgs)
      for (let i = 0; i < 6; i++) {
        const g = (lossDiff / (2 * ck)) * deltas[i]
        const ak = a[i] / (A + k + 1) ** alpha
        values[i] = fix(values[i] - ak * g, i)
      }

      const loss = this.loss(values)
      if (loss < bestLoss) {
        best = values.slice(0)
        bestLoss = loss
      }
    }
    return { values: best, loss: bestLoss }

    function fix(value: number, idx: number): number {
      let max = 100
      if (idx === 2 /* saturate */) {
        max = 7500
      }
      else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
        max = 200
      }

      if (idx === 3 /* hue-rotate */) {
        if (value > max) {
          value %= max
        }
        else if (value < 0) {
          value = max + (value % max)
        }
      }
      else if (value < 0) {
        value = 0
      }
      else if (value > max) {
        value = max
      }
      return value
    }
  }

  private loss(filters: number[]): number {
    const color = Color.fromRGB({ red: 0, green: 0, blue: 0 })
    color.invert(filters[0] / 100)
    color.sepia(filters[1] / 100)
    color.saturate(filters[2] / 100)
    color.hueRotate(filters[3] * 3.6)
    color.brightness(filters[4] / 100)
    color.contrast(filters[5] / 100)

    const rgb = color.toRGB()
    const hsl = color.toHSL()
    return (
      Math.abs(rgb.red - this.rgb.red)
      + Math.abs(rgb.green - this.rgb.green)
      + Math.abs(rgb.blue - this.rgb.blue)
      + Math.abs(hsl.hue - this.hsl.hue)
      + Math.abs(hsl.saturation - this.hsl.saturation)
      + Math.abs(hsl.lightness - this.hsl.lightness)
    )
  }

  private css(filters: number[]): CssFilter {
    function fmt(idx: number, multiplier = 1) {
      return Math.round(filters[idx] * multiplier)
    }
    return `invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(
            2,
        )}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(
            5,
        )}%);`
  }
}

export class Color {
  private r = 0
  private g = 0
  private b = 0

  private constructor(r: number, g: number, b: number) {
    this.r = this.clamp(r)
    this.g = this.clamp(g)
    this.b = this.clamp(b)
  }

  public static fromHex(hex: Hex): Color {
    let value = hex.replace('#', '')

    let red = 0
    let green = 0
    let blue = 0

    if (value.length === 4)
      value = value.substring(0, 3)
    if (value.length === 8)
      value = value.substring(0, 6)

    function parseHexChannels(hex: string, channels: number[]) {
      return Number.parseInt(`0x${channels.map(channel => hex[channel]).join('')}`)
    }

    if (value.length === 3) {
      red = parseHexChannels(value, [0, 0])
      green = parseHexChannels(value, [1, 1])
      blue = parseHexChannels(value, [2, 2])
    }
    else {
      red = parseHexChannels(value, [0, 1])
      green = parseHexChannels(value, [2, 3])
      blue = parseHexChannels(value, [4, 5])
    }

    return new Color(red, green, blue)
  }

  public static fromRGB(rgb: RGB): Color {
    return new Color(rgb.red, rgb.green, rgb.blue)
  }

  public static fromHSL(hsl: HSL): Color {
    let { hue: h, saturation: s, lightness: l } = hsl

    if (h < 0)
      h = 0
    if (s < 0)
      s = 0
    if (l < 0)
      l = 0
    if (h >= 360)
      h = 359
    if (s > 100)
      s = 100
    if (l > 100)
      l = 100
    s /= 100
    l /= 100

    const C = (1 - Math.abs(2 * l - 1)) * s
    const hh = h / 60
    const X = C * (1 - Math.abs((hh % 2) - 1))
    let r = 0
    let g = 0
    let b = 0

    if (hh >= 0 && hh < 1) {
      r = C
      g = X
    }
    else if (hh >= 1 && hh < 2) {
      r = X
      g = C
    }
    else if (hh >= 2 && hh < 3) {
      g = C
      b = X
    }
    else if (hh >= 3 && hh < 4) {
      g = X
      b = C
    }
    else if (hh >= 4 && hh < 5) {
      r = X
      b = C
    }
    else {
      r = C
      b = X
    }

    const m = l - C / 2
    r += m
    g += m
    b += m
    r *= 255.0
    g *= 255.0
    b *= 255.0
    r = Math.round(r)
    g = Math.round(g)
    b = Math.round(b)

    return new Color(r, g, b)
  }

  public toHSL(): HSL {
    let red = this.r
    let green = this.g
    let blue = this.b

    red /= 255
    green /= 255
    blue /= 255

    const channelMin = Math.min(red, green, blue)
    const channelMax = Math.max(red, green, blue)
    const delta = channelMax - channelMin

    let hue = 0
    let saturation = 0
    let lightness = 0

    if (delta === 0)
      hue = 0
    else if (channelMax === red)
      hue = ((green - blue) / delta) % 6
    else if (channelMax === green)
      hue = (blue - red) / delta + 2
    else hue = (red - green) / delta + 4

    hue = Math.round(hue * 60)

    if (hue < 0)
      hue += 360

    lightness = (channelMax + channelMin) / 2
    saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
    saturation = +(saturation * 100).toFixed(1)
    lightness = +(lightness * 100).toFixed(1)

    return {
      hue,
      saturation,
      lightness,
    }
  }

  public toRGB(): RGB {
    return {
      red: this.r,
      green: this.g,
      blue: this.b,
    }
  }

  public toHex(): Hex {
    return (`#${((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1).toUpperCase()}`) as Hex
  }

  public hueRotate(angle = 0) {
    angle = (angle / 180) * Math.PI
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)

    this.multiply([
      0.213 + cos * 0.787 - sin * 0.213,
      0.715 - cos * 0.715 - sin * 0.715,
      0.072 - cos * 0.072 + sin * 0.928,
      0.213 - cos * 0.213 + sin * 0.143,
      0.715 + cos * 0.285 + sin * 0.14,
      0.072 - cos * 0.072 - sin * 0.283,
      0.213 - cos * 0.213 - sin * 0.787,
      0.715 - cos * 0.715 + sin * 0.715,
      0.072 + cos * 0.928 + sin * 0.072,
    ])
  }

  public grayscale(value = 1) {
    this.multiply([
      0.2126 + 0.7874 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 + 0.2848 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 + 0.9278 * (1 - value),
    ])
  }

  public sepia(value = 1) {
    this.multiply([
      0.393 + 0.607 * (1 - value),
      0.769 - 0.769 * (1 - value),
      0.189 - 0.189 * (1 - value),
      0.349 - 0.349 * (1 - value),
      0.686 + 0.314 * (1 - value),
      0.168 - 0.168 * (1 - value),
      0.272 - 0.272 * (1 - value),
      0.534 - 0.534 * (1 - value),
      0.131 + 0.869 * (1 - value),
    ])
  }

  public saturate(value = 1) {
    this.multiply([
      0.213 + 0.787 * value,
      0.715 - 0.715 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 + 0.285 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 - 0.715 * value,
      0.072 + 0.928 * value,
    ])
  }

  public brightness(value = 1) {
    this.linear(value)
  }

  public contrast(value = 1) {
    this.linear(value, -(0.5 * value) + 0.5)
  }

  public invert(value = 1) {
    this.r = this.clamp((value + (this.r / 255) * (1 - 2 * value)) * 255)
    this.g = this.clamp((value + (this.g / 255) * (1 - 2 * value)) * 255)
    this.b = this.clamp((value + (this.b / 255) * (1 - 2 * value)) * 255)
  }

  private multiply(matrix: number[]) {
    const newR = this.clamp(
      this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2],
    )
    const newG = this.clamp(
      this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5],
    )
    const newB = this.clamp(
      this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8],
    )
    this.r = newR
    this.g = newG
    this.b = newB
  }

  private linear(slope = 1, intercept = 0) {
    this.r = this.clamp(this.r * slope + intercept * 255)
    this.g = this.clamp(this.g * slope + intercept * 255)
    this.b = this.clamp(this.b * slope + intercept * 255)
  }

  private clamp(value: number) {
    if (value > 255) {
      value = 255
    }
    else if (value < 0) {
      value = 0
    }
    return value
  }
}

interface Wide { loss: number, values: number[] }

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type Lightness<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>
