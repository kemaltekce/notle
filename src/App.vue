<script setup>
import { ref } from 'vue'
import Hello from './components/Hello.vue'

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
    <Hello msg="notle."/>
  </div>
</template>

<style scoped>
</style>
