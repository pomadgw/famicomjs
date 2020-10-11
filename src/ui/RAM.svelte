<script>
  import opcodes from '../6502/instructions'
  import disassember, { argParamsGenerator } from '../6502/disassembler'
  export let ram
  export let offsetStart
  export let offsetEnd

  const argParams = argParamsGenerator(offsetEnd)

  $: content = (() => {
    const result = []

    let remainingParams = 0

    for (let i = offsetStart; i < offsetEnd; i += 1) {
      remainingParams -= 1

      if (remainingParams <= 0) {
        remainingParams = argParams[opcodes[ram[i]].addressingName].length
      }

      result.push(ram[i])
    }

    if (remainingParams > 0) {
      for (let i = offsetEnd; i < offsetEnd + remainingParams; i += 1) {
        result.push(ram[i])
      }
    }

    return Object.entries(disassember(result, { binaryStart: offsetStart }))
  })()
</script>

<div>
  <table class="font-mono table-fixed">
{#each content as [index, value] }
  <tr>
    <td class="w-1/3">{index}</td>
    <td>{value}</td>
  </tr>
{/each}
</table>
</div>
