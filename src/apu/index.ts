export type OnAudioReady = (output: number) => void

export default class APU {
  public sampleRate: number
  public timeInSampleRate: number
  public globalStartTime: number
  public isAudioReady: boolean
  public output: number
  public context: AudioContext
  public onAudioReady?: OnAudioReady

  constructor(sampleRate: number, onAudioReady?: OnAudioReady) {
    this.sampleRate = sampleRate
    this.timeInSampleRate = 1000 / sampleRate
    this.context = new AudioContext()
    this.globalStartTime = this.context.currentTime

    this.isAudioReady = false
    this.output = 0
    this.onAudioReady = onAudioReady
  }

  clock() {
    const now = this.context.currentTime
    if (now - this.globalStartTime >= this.timeInSampleRate) {
      this.isAudioReady = true
      this.globalStartTime = now
      if (this.onAudioReady) this.onAudioReady(this.output)
    }
  }
}
