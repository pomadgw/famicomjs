<script>
  import { onMount } from 'svelte'
  import Cartridge from '../cartridge'
  import Bus from '../bus'
  import CPU from '../6502/cpu'
  import PPU from '../ppu'

  let nes
  let canvas
  let zoomCanvas
  let emulationMode = false
  let ctx
  let startFrame

  nes = new Bus(new CPU(), new PPU())

  function toggleEmulation() {
    emulationMode = !emulationMode
  }

  async function readFile(event) {
    const file = event.target.files[0]
    const cart = new Cartridge()
    await cart.parse(file)

    nes.insertCartridge(cart)
    nes.reset()
  }

  function resetNES() {
    nes.reset()
  }

  function stepNES() {
    do {
      nes.clock()
    } while (!nes.cpu.isComplete)

    do {
      nes.clock()
    } while (nes.cpu.isComplete)

    render()
  }

  function render() {
    const zoomCtx = zoomCanvas.getContext('2d')
    ctx.putImageData(nes.ppu.getScreen().imageData, 0, 0)

    zoomCtx.imageSmoothingEnabled = false
    zoomCtx.mozImageSmoothingEnabled = false
    zoomCtx.webkitImageSmoothingEnabled = false
    zoomCtx.msImageSmoothingEnabled = false

    zoomCtx.drawImage(canvas, 0, 0, 256, 240, 0, 0, 512, 480)
  }

  function renderSingleFrame() {
    do {
      nes.clock()
    } while (!nes.ppu.isFrameComplete)

    do {
      nes.clock()
    } while (nes.cpu.isComplete)
    nes.ppu.isFrameComplete = false

    render()
  }

  function runEmulation(timestamp) {
    if (emulationMode) {
      if (!startFrame) startFrame = timestamp

      if (timestamp - startFrame >= 1000 / 60) {
        startFrame = timestamp

        do {
          nes.clock()
        } while (!nes.ppu.isFrameComplete)
        nes.ppu.isFrameComplete = false

        render()
      }

      requestAnimationFrame(runEmulation)
    }
  }

  $: if (emulationMode) {
    console.log('!')
    requestAnimationFrame(runEmulation)
  }

  onMount(() => {
    ctx = canvas.getContext('2d')
  })
</script>

<canvas style="display: none" width="640" height="480" bind:this={canvas}></canvas>
<canvas width="640" height="480" bind:this={zoomCanvas}></canvas>
<input type="file" on:change={readFile} />
<button on:click={resetNES}>Reset</button>
<button on:click={stepNES}>Execute Code Step-by-Step</button>
<button on:click={renderSingleFrame}>Execute Code for Whole Frame</button>
<button on:click={toggleEmulation}>Toggle Emulation: {emulationMode ? 'on' : 'off'}</button>
