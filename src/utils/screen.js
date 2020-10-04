export default class Screen {
  constructor(width, height) {
    this.width = width
    this.height = height

    this.image = new Uint8ClampedArray(width * height * 4)

    this.imageData = new ImageData(this.image, width)
  }

  setColor(x, y, { r, g, b }) {
    const pos = (y * this.width + x) * 4
    this.image[pos + 0] = r
    this.image[pos + 1] = g
    this.image[pos + 2] = b
    this.image[pos + 3] = 255
  }
}
