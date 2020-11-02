<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  import opcodes from '../6502/instructions'
  import disassember, { argParamsGenerator } from '../6502/disassembler'
  export let ram
  export let offsetStart
  export let offsetEnd
  export let length
  export let pc
  export let followPC = true

  const toHex = num => `$${num.toString(16).toUpperCase().padStart(4, '0')}`
  const fromHex = num => parseInt(num.replace('$', ''), 16)

  const argParams = argParamsGenerator(offsetEnd)

  $: entries = Object.entries(ram)
  $: realOffsetStart = entries.map(e => e[0]).indexOf(toHex(offsetStart))

  $: content = (() => {
    if (followPC) {
      const pcStart = entries.map(e => e[0]).indexOf(toHex(pc))
      const halfLength = Math.floor(length / 2)
      return Object.entries(ram).slice(pcStart - halfLength, pcStart + halfLength)
    }
    return Object.entries(ram).slice(realOffsetStart, realOffsetStart + length)
  })()

  $: formattedPC = `$${pc.toString(16).toUpperCase().padStart(4, '0')}`

  function up() {
    if (realOffsetStart > 0) {
      dispatch('change', {
        value: {
          offsetStart: fromHex(entries[realOffsetStart - 1][0]),
        }
      })
    }
  }

  function down() {
    if (realOffsetStart < 0xffff) {
      dispatch('change', {
        value: {
          offsetStart: fromHex(entries[realOffsetStart + 1][0]),
        }
      })
    }
  }
</script>

<div>
  <table class="font-mono table-fixed w-full">
  <tr>
    <td class="text-center" colspan="2">
      <button class="block w-full" on:click={up}>Up</button>
    </td>
  </tr>
{#each content as [index, value] }
  <tr class={formattedPC === index ? 'bg-red-400' : ''}>
    <td class="w-1/3">{index}</td>
    <td>{value}</td>
  </tr>
{/each}
    <td class="text-center" colspan="2">
      <button class="block w-full" on:click={down}>Down</button>
    </td>
</table>
</div>
