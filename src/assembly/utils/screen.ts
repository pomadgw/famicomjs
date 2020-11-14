export class RGB {
  public r: u8
  public g: u8
  public b: u8
}

export default class Screen {
  public width: i32
  public height: i32
  public image: Uint8ClampedArray
  // public imageData: ImageData

  constructor(width: i32, height: i32) {
    this.width = width
    this.height = height

    this.image = new Uint8ClampedArray(width * height * 4)

    // this.imageData = new ImageData(this.image, width)
  }

  setColor(x: i32, y: i32, color: RGB): void {
    const pos = (y * this.width + x) * 4
    this.image[pos + 0] = color.r
    this.image[pos + 1] = color.g
    this.image[pos + 2] = color.b
    this.image[pos + 3] = 255
  }
}
