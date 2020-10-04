<script>
  export let ram
  export let offsetStart
  export let offsetEnd
  console.log(ram)

  $: content = (() => {
    const result = []
    for (let i = offsetStart; i < offsetEnd; i += 1) {
      result.push(ram[i])
    }

    return result
  })()
</script>

<div>
{#each content as value, index }
  <div>{index}: {value}</div>
{/each}
</div>
