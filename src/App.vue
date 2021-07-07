<template>
  <div>
    <canvas ref="canvas" width="256" height="240" />

    <div><button @click="resetNES">Reset</button></div>
  </div>
</template>

<script lang="ts" src="./App.ts"></script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

canvas {
  width: 512px;
  image-rendering: pixelated;
}
</style>
