<script>
  import { onMount } from 'svelte'
  import RAM from './RAM.svelte'
  import Register from './Register.svelte'

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
  let showRAM = true
  let offsetStart = 0x8000
  let registers

  nes = new Bus(new CPU(), new PPU())

  function toggleEmulation() {
    emulationMode = !emulationMode
  }

  async function readFile(event) {
    const file = event.target.files[0]
    const cart = new Cartridge()
    await cart.parse(file)

    nes.cartridge = cart
    nes.insertCartridge(cart)
    nes.reset()

    offsetStart = nes.cpu.registers.PC
    registers = nes.cpu.registers
  }

  function resetNES() {
    nes.reset()
    offsetStart = nes.cpu.registers.PC
    registers = nes.cpu.registers
  }

  function stepNES() {
    do {
      nes.clock()
    } while (!nes.cpu.isComplete)

    do {
      nes.clock()
    } while (nes.cpu.isComplete)

    offsetStart = nes.cpu.registers.PC
    registers = nes.cpu.registers

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

    offsetStart = nes.cpu.registers.PC
    registers = nes.cpu.registers

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

        offsetStart = nes.cpu.registers.PC
        registers = nes.cpu.registers

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

<div class="flex m-auto p-10">
  <div class="flex flex-col flex-2">
    <div>
      <canvas class="hidden" width="256" height="240" bind:this={canvas}></canvas>
      <canvas width="640" height="480" bind:this={zoomCanvas}></canvas>
    </div>
    <div class="flex items-center mt-4">
      <input type="file" on:change={readFile} />
      <label>
        <input type="checkbox" bind:checked={showRAM} />
        Show RAM content
      </label>
      <button class="ml-2" on:click={resetNES}>Reset</button>
      <button class="ml-2" on:click={stepNES}>Execute Code Step-by-Step</button>
      <button class="ml-2" on:click={renderSingleFrame}>Execute Code for Whole Frame</button>
      <button class="ml-2" on:click={toggleEmulation}>Toggle Emulation: {emulationMode ? 'on' : 'off'}</button>
    </div>
  </div>
  <div class="ml-4 flex-1 flex flex-col">
    <div>
      PC: <span class="font-mono">${offsetStart.toString(16).padStart(4, '0')}</span>
    </div>
    <div>
      <Register registers={registers} />
    </div>
    {#if nes.cartridge && showRAM}
    <div class="mt-4">
      <RAM ram={nes.cpu.ram} offsetStart={offsetStart} offsetEnd={offsetStart + 0x30} />
    </div>
    {/if}
  </div>
</div>
