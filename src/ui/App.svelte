<script>
  import Cartridge from '../cartridge'

  function checkFile(event) {
    const file = event.target.files[0]
    console.log(file)
    const cart = new Cartridge()
    cart.parse(file)
  }
</script>
<canvas id="canvas" width="640" height="480"></canvas>
<input type="file" on:change={checkFile} />
