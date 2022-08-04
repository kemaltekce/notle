<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})
</script>

<template>
  <h1>{{ msg }}</h1>
  <p>yet another note-taking app</p>
  <p>coming soonish...</p>

</template>

<style scoped>
h1 {
  letter-spacing: 0.3em;
}
</style>
