<script>
  import { afterUpdate } from 'svelte'
  import toHex from '../utils/tohex'

  export let registers

  let flags = ['N', 'V', 'U', 'B', 'D', 'I', 'Z', 'C']

  function checkFlag(flag) {
    return registers?.STATUS?.[flag] ? 'text-red-500 font-bold' : 'text-black'
  }

  $: flagsClass = flags.map(flag => [flag, checkFlag(flag)])

  afterUpdate(() => {
    flags = flags
  })
</script>

Register:

<table class="table-fixed">
  <tr>
    <td class="w-1/2">STATUS</td>
    <td class="font-mono">
      {#each flagsClass as [flag, flagClass] }
        <span class={flagClass}>{flag}</span>
      {/each}
    </td>
  </tr>
  <tr>
    <td>A</td>
    <td class="font-mono">${toHex(registers?.A ?? 0)}</td>
  </tr>
  <tr>
    <td>X</td>
    <td class="font-mono">${toHex(registers?.X ?? 0)}</td>
  </tr>
  <tr>
    <td>Y</td>
    <td class="font-mono">${toHex(registers?.Y ?? 0)}</td>
  </tr>
  <tr>
    <td>SP</td>
    <td class="font-mono">${toHex(registers?.SP ?? 0)}</td>
  </tr>
</table>
