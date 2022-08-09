<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})
</script>

<template>
  <svg class="semicolon" width="100" height="280" viewBox="0 0 100 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#383838"/>
    <rect y="110" width="100" height="100" fill="#383838"/>
    <path d="M0 259.004C0 259.004 32.7643 255.244 43 240.004C49.9196 229.701 50 209.004 50 209.004C50 209.004 88 209.004 100 209.004C100 230.5 89.8164 245.909 72.5 261.004C50.5097 280.173 0 279.004 0 279.004V259.004Z" fill="#383838"/>
  </svg>

  <h1 class="title">{{ msg }}</h1>
  <div class="subtitle">
    <p>yet another note-taking app.</p>
    <p>coming soonish...</p>
  </div>

</template>

<style scoped>

.title {
  letter-spacing: 0.3em;
  position: absolute;
  top: 25vh;
  color: #f1f1f1;
  padding-left: 2vh;
  font-size: 5vh;
}

.subtitle {
  letter-spacing: 0.2em;
  position: absolute;
  top: 42vh;
  color: #f1f1f1;
  padding-left: 2vh;
  font-size: 1.5vh;
}

.semicolon {
  height: 90vh;
  width: auto;
}
</style>
