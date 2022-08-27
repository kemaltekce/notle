<script setup>
  import { ref } from 'vue'
  import Semicolon from '../components/Semicolon.vue'

  var colorID = ref(0)
  var colors = ['#F7F7F7', '#FFF7EC', '#F5E3D9', '#ECF2FE', '#C9D8D8']

  function changeColor() {
    // which color is next
    colorID.value += 1
    if (colorID.value === Object.keys(colors).length) {
      colorID.value = 0
    }

    // change color
    var root = document.documentElement
    root.style.backgroundColor = colors[colorID.value]
  }
</script>

<template>
  <div @click="changeColor">
      <Semicolon title='notle.'></Semicolon>

    <div class="subtitle">
      <p>yet another note-taking app.</p>
      <p>coming soonish...</p>
    </div>
  </div>
</template>

<style scoped>
  .title {
    letter-spacing: 0.3em;
    position: absolute;
    top: 25vh;
    color: #f7f7f7;
    padding-left: 2vh;
    font-size: 5vh;
  }

  .subtitle {
    letter-spacing: 0.2em;
    position: absolute;
    top: 42vh;
    color: #f7f7f7;
    padding-left: 2vh;
    font-size: 1.5vh;
  }

  .semicolon {
    height: 90vh;
    width: auto;
  }
</style>
