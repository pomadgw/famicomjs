import { defineComponent } from 'vue'

import NESRunner, { IButtons, Buttons } from './runner'

interface Data {
  nes: NESRunner | null
  Buttons: IButtons
  isNESStart: boolean
  romData: ArrayBuffer
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

export default defineComponent({
  name: 'App',
  data(): Data {
    return {
      nes: null,
      Buttons,
      isNESStart: false,
      romData: new ArrayBuffer(0)
    }
  },
  async mounted() {
    this.nes = new NESRunner()

    const canvas: HTMLCanvasElement | null = this.$refs
      .canvas as HTMLCanvasElement

    const ctx = canvas?.getContext('2d')

    if (ctx) {
      this.nes.renderImage(ctx)
    }
  },
  methods: {
    async initializeNES() {
      if (this.nes) {
        await this.nes.initializeAudioContext()

        this.nes.installKeyboardEventListener()
        this.isNESStart = true

        if (this.romData.byteLength > 0) {
          this.nes?.loadROM(this.romData)
        }
      }
    },
    pauseNES() {
      if (this.nes) {
        this.nes.pause()
      }
    },
    resumeNES() {
      if (this.nes) {
        this.nes.resume()
      }
    },
    resetNES() {
      if (this.nes) {
        this.nes.reset()
      }
    },
    saveData() {
      if (this.nes) {
        this.nes.saveData()
      }
    },
    loadData() {
      if (this.nes) {
        this.nes.loadData()
      }
    },
    click(button: number) {
      if (this.nes) {
        this.keyDownButton(button)
        setTimeout(() => {
          this.keyUpButton(button)
        }, 10)
      }
    },
    async loadROM(e: HTMLInputEvent) {
      const { files } = e.target

      if (files && files.length > 0) {
        const file = files[0]
        const name = file.name

        await file.arrayBuffer().then((arrayBuffer) => {
          this.romData = arrayBuffer

          if (this.isNESStart) {
            this.nes?.setName(name)
            this.nes?.loadROM(arrayBuffer)
          }
        })
      }
    },
    keyDownButton(button: number) {
      if (this.nes) {
        this.nes.keyDownButton(button)
      }
    },
    keyUpButton(button: number) {
      if (this.nes) {
        this.nes.keyUpButton(button)
      }
    }
  }
})
