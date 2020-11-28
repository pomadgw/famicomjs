export type OnAudioReady = (output: number) => void

export default class APU {
  public currentTime: number
  public now: number
  public output: number
  public isAudioReady: boolean
  // public onAudioReady?: OnAudioReady

  constructor(onAudioReady?: OnAudioReady) {
    this.currentTime = typeof performance !== 'undefined' ? performance.now() : 0
    this.now = 0
    this.output = 0
    this.isAudioReady = false
    // this.onAudioReady = onAudioReady
  }

  clock() {
    this.now = typeof performance !== 'undefined' ? performance.now() : (this.now + 1)

    if (this.now - this.currentTime >= 400) {
      this.output = (Math.random() * 2 - 1) * 0.5
      this.currentTime = this.now
      this.isAudioReady = true

      // if (this.onAudioReady) this.onAudioReady(this.output)
    }
  }
}
