export default class Screen {
  constructor(width, height) {
    this.width = width
    this.height = height

    this.image = new Uint8ClampedArray(width * height * 4)

    if (typeof ImageData !== 'undefined')
      this.imageData = new ImageData(this.image, width)
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height,
      image: [...this.image]
    }
  }

  loadState(state) {
    this.width = state.width
    this.height = state.height
    this.image = new Uint8ClampedArray(state.image)
    if (typeof ImageData !== 'undefined')
      this.imageData = new ImageData(this.image, state.width)
  }

  setColor(x, y, { r, g, b }) {
    const pos = (y * this.width + x) * 4
    this.image[pos + 0] = r
    this.image[pos + 1] = g
    this.image[pos + 2] = b
    this.image[pos + 3] = 255
  }
}
