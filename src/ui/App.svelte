<script>
  import { onMount } from 'svelte'
  import RAM from './RAM.svelte'
  import Register from './Register.svelte'
  import toHex from '../utils/tohex'

  import disassember, { argParamsGenerator } from '../6502/disassembler'
  import Cartridge from '../cartridge'
  import Bus from '../bus'
  import CPU from '../6502'
  import PPU from '../ppu'

  let nes
  let canvas
  let zoomCanvas
  let paletteCanvas
  let paletteCanvas2
  let emulationMode = false
  let ctx
  let startFrame
  let showDebug = true
  let offsetStart = 0x8000
  let nesPC = 0x8000
  let registers
  let oams = []
  let selectedPalette = 0x00
  let selectedTable = new Uint8Array(1024)
  let ram

  let disassembled

  nes = new Bus(new CPU(), new PPU(), render )

  function toggleEmulation() {
    emulationMode = !emulationMode
  }

  function disassembleRAM(force = false) {
    if (showDebug || force) {
      ram = nes.getRAMSnapshot(0x0000)
      disassembled = disassember(ram, { binaryStart: 0 })
    }
  }

  async function readFile(event) {
    const file = event.target.files[0]

    const reader = new FileReader()
    const data = await new Promise((resolve, reject) => {
      reader.addEventListener('load', (event) => {
        resolve(event.target.result)
      })

      reader.readAsArrayBuffer(file)
    })
    const view = new Uint8Array(data)

    const cart = new Cartridge()
    cart.parse(view)

    nes.cartridge = cart
    nes.insertCartridge(cart)
    nes.reset()

    offsetStart = nes.cpu.PC
    nesPC = nes.cpu.PC
    registers = nes.cpu

    disassembleRAM()
    oams = nes.ppu.oam
    emulationMode = false
  }

  function resetNES() {
    nes.reset()
    offsetStart = nes.cpu.PC
    nesPC = nes.cpu.PC
    registers = nes.cpu
    disassembleRAM()
  }

  function stepNES() {
    do {
      nes.clock()
    } while (nes.cpu.clocks !== 0)

    do {
      nes.clock()
    } while (nes.cpu.clocks === 0)

    nesPC = nes.cpu.PC
    registers = nes.cpu
    oams = nes.ppu.oam
    disassembleRAM()

    render(nes.ppu.getScreen().imageData)
  }

  function dumpPPU() {
    console.log('tablePattern', nes.ppu.tablePattern)
    console.log('chr memory', nes.cartridge.chrMemory)
  }

  function dumpCPUMemory() {
    disassembleRAM(true)
    console.log('ram value', ram)
  }

  function render(imageData) {
    const zoomCtx = zoomCanvas.getContext('2d')
    ctx.putImageData(imageData, 0, 0)
    zoomCtx.drawImage(canvas, 0, 0, 256, 240, 0, 0, 512, 480)

    if (showDebug) {
      drawPalette()
      drawTableName()
    }
  }

  function drawTableName() {
    selectedTable = nes.ppu.tableName[0]
  }

  function renderSingleFrame() {
    do {
      nes.clock()
    } while (!nes.ppu.isFrameComplete)

    do {
      nes.clock()
    } while (nes.cpu.isComplete)
    nes.ppu.isFrameComplete = false

    nesPC = nes.cpu.PC
    registers = nes.cpu
    oams = nes.ppu.oam
    disassembleRAM()
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

        nesPC = nes.cpu.PC
        registers = nes.cpu
        oams = nes.ppu.oam
        disassembleRAM()
      }

      requestAnimationFrame(runEmulation)
    }
  }

  function drawPalette() {
    const pCtx = paletteCanvas.getContext('2d')
    const pCtx2 = paletteCanvas2.getContext('2d')

    pCtx.putImageData(nes.ppu.getPatternTable(0, selectedPalette).imageData, 0, 0)
    pCtx2.putImageData(nes.ppu.getPatternTable(1, selectedPalette).imageData, 0, 0)
  }

  function updateOffset({ detail: { value } }) {
    offsetStart = value.offsetStart
  }

  $: if (emulationMode) {
    requestAnimationFrame(runEmulation)
  }

  $: if (selectedPalette > 7) {
    selectedPalette = selectedPalette % 7
  } else if (selectedPalette < 0) {
    selectedPalette = 7
  }

  $: paletteColors = (() => {
    if (!nes.cartridge) return []
    const toRgb = ({ r, g, b }) => `#${toHex(r)}${toHex(g)}${toHex(b)}`

    return [...Array(8).keys()].map(i => toRgb(nes.ppu.getColorFromPaletteRAM(selectedPalette, i)))
  })()

  onMount(() => {
    ctx = canvas.getContext('2d')

    const zoomCtx = zoomCanvas.getContext('2d')
  })
</script>

<div class="flex m-auto p-10">
  <div class="flex flex-2">
    <div>
      <canvas class="hidden" width="256" height="240" bind:this={canvas}></canvas>
      <div class="m-auto border-2 border-blue-400" style="width: 512px">
        <canvas width="512" height="480" bind:this={zoomCanvas}></canvas>
      </div>
      <!-- <table class="font-mono">
        {#each Array(30) as _, y}
        <tr>
          {#each Array(32) as _, x}
            <td>
              {(selectedTable[y * 32 + x]).toString(16).padStart(2, '0')}
            </td>
          {/each}
        </tr>
        {/each }
      </table> -->
    </div>
    <div class="flex flex-column ml-4">
      <input type="file" accept=".nes" on:change={readFile} />
      <label class="mt-2">
        <input type="checkbox" bind:checked={showDebug} />
        Show Debug Tools
      </label>
      <button class="mt-2" on:click={resetNES}>Reset</button>
      <button class="mt-2" on:click={stepNES}>Execute Code Step-by-Step</button>
      <button class="mt-2" on:click={dumpCPUMemory}>Dump RAM into Console</button>
      <button class="mt-2" on:click={dumpPPU}>Dump PPU memory into Console</button>
      <button class="mt-2" on:click={renderSingleFrame}>Execute Code for Whole Frame</button>
      <button class="mt-2" on:click={toggleEmulation}>{emulationMode ? 'Pause' : 'Run'}</button>
    </div>
  </div>
  {#if showDebug}
  <div class="ml-4 p-2" style="max-height: 90vh; overflow-y: scroll;">
    <div class="text-xl text-center">Debug</div>
    <div class="mt-4">
      <div>
        <div class="form-group row">
          <label for="palettenumber" class="col-sm-2 col-form-label">Palette</label>
          <div class="col-sm-8">
            <input name="palettenumber" class="text-black form-control" type="number" bind:value={selectedPalette} min=0 max=7 />
          </div>
          <div class="col-sm-2 flex">
            <!-- <div class="w-full"> -->
              {#each paletteColors as color}
              <div class="flex-1" style={`background-color: ${color}`}></div>
              {/each}
            <!-- </div> -->
          </div>
        </div>
      </div>
      <div class="flex mt-4">
        <canvas class="m-auto border-2 border-blue-400" style="width: 256px" width="128" height="128" bind:this={paletteCanvas}></canvas>
        <canvas class="ml-2 m-auto border-2 border-blue-400" style="width: 256px" width="128" height="128" bind:this={paletteCanvas2}></canvas>
      </div>
    </div>
    <div class="mt-4 overflow-y-scroll" style="height: 300px">
      <div class="text-xl text-center mb-4 font-bold">OAMs</div>
      <table class="table text-gray-200">
        <tr>
          <th></th>
          <th>x</th>
          <th>y</th>
          <th>ID</th>
          <th>Attrib.</th>
        </tr>
        {#each oams as oam, index}
        <tr>
          <td>{index.toString(16).padStart(2, '0')}</td>
          <td>{oam.x}</td>
          <td>{oam.y}</td>
          <td>{oam.id.toString(16).padStart(2, '0')}</td>
          <td>{oam.attrib}</td>
        </tr>
        {/each}
      </table>
    </div>
    <div class="mt-4 flex-1 flex flex-col">
      <div>
        PC: <span class="font-mono">{toHex(nesPC, { withPrefix: true, length: 4 })}</span>
      </div>
      <div>
        <Register registers={registers} />
      </div>
      {#if nes.cartridge && showDebug}
      <div class="mt-4">
        <RAM ram={disassembled} offsetStart={offsetStart} length={0x10} pc={nesPC} on:change={updateOffset} />
      </div>
      <div class="mt-4">
        <table class="table">
        </table>
      </div>
      {/if}
    </div>
  </div>
  {/if}
</div>
