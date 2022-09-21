<template>
  <div>
    <div class="flex align-items-center justify-center">
      <canvas
        ref="canvas"
        width="256"
        height="240"
        class="sm:w-full md:max-w-md"
      />
    </div>
    <div>
      <div v-if="isNESStart" class="px-4 py-2">
        <div class="custom-file">
          <input
            type="file"
            class="custom-file-input"
            id="customFile"
            @change="loadROM"
          />
          <label class="custom-file-label" for="customFile">Choose file</label>
        </div>
      </div>
      <div class="px-4 py-2">
        <button
          v-if="!isNESStart"
          class="w-full bg-red-400 rounded-md p-2 mb-2"
          @click="initializeNES"
        >
          Initialize
        </button>
        <button
          v-if="isNESStart"
          class="w-full bg-red-400 rounded-md p-2 mb-2"
          @click="pauseNES"
        >
          Pause
        </button>
        <button
          v-if="isNESStart"
          class="w-full bg-red-400 rounded-md p-2 mb-2"
          @click="resumeNES"
        >
          Resume
        </button>
        <button
          v-if="isNESStart"
          class="w-full bg-red-400 rounded-md p-2 mb-2"
          @click="saveData"
        >
          Save
        </button>
        <button
          v-if="isNESStart"
          class="w-full bg-red-400 rounded-md p-2 mb-2"
          @click="loadData"
        >
          Load
        </button>
        <button
          v-if="isNESStart"
          class="w-full bg-red-400 rounded-md p-2 mb-2"
          @click="resetNES"
        >
          Reset
        </button>
      </div>
      <div v-if="isNESStart" class="flex justify-around">
        <div class="d-pad">
          <div style="grid-column: 2; grid-row: 1">
            <button
              @touchstart="keyDownButton(Buttons.UP)"
              @touchend="keyUpButton(Buttons.UP)"
            >
              <div class="arrow-up"></div>
            </button>
          </div>
          <div style="grid-column: 1; grid-row: 2">
            <button
              @touchstart="keyDownButton(Buttons.LEFT)"
              @touchend="keyUpButton(Buttons.LEFT)"
            >
              <div class="arrow-left"></div>
            </button>
          </div>
          <div style="grid-column: 2; grid-row: 3">
            <button
              @touchstart="keyDownButton(Buttons.DOWN)"
              @touchend="keyUpButton(Buttons.DOWN)"
            >
              <div class="arrow-down"></div>
            </button>
          </div>
          <div style="grid-column: 3; grid-row: 2">
            <button
              @touchstart="keyDownButton(Buttons.RIGHT)"
              @touchend="keyUpButton(Buttons.RIGHT)"
            >
              <div class="arrow-right"></div>
            </button>
          </div>
        </div>
        <div class="flex justify-around flex-col w-40">
          <div class="flex">
            <div class="flex-1 mb-2 px-1">
              <button
                class="w-full bg-gray-400 rounded-md p-2"
                @touchstart="keyDownButton(Buttons.B)"
                @touchend="keyUpButton(Buttons.B)"
              >
                B
              </button>
            </div>
            <div class="flex-1 mb-2 px-1">
              <button
                class="w-full bg-gray-400 rounded-md p-2"
                @touchstart="keyDownButton(Buttons.A)"
                @touchend="keyUpButton(Buttons.A)"
              >
                A
              </button>
            </div>
          </div>
          <div class="flex-1 mb-2 px-1">
            <button
              class="w-full bg-gray-400 rounded-md p-2"
              @touchstart="keyDownButton(Buttons.SELECT)"
              @touchend="keyUpButton(Buttons.SELECT)"
            >
              Select
            </button>
          </div>
          <div class="flex-1 px-1">
            <button
              class="w-full bg-gray-400 rounded-md p-2"
              @touchstart="keyDownButton(Buttons.START)"
              @touchend="keyUpButton(Buttons.START)"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
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
}

canvas {
  width: 512px;
  image-rendering: pixelated;
}

.d-pad {
  display: grid;
  grid-template-columns: repeat(3, 40px);
  grid-template-rows: repeat(3, 40px);
}

.arrow-up {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;

  border-bottom: 40px solid black;
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;

  border-top: 40px solid black;
}

.arrow-right {
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;

  border-left: 40px solid black;
}

.arrow-left {
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;

  border-right: 40px solid black;
}
</style>
