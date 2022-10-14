<script setup>
  import { onBeforeMount } from "vue"
  import Semicolon from '../components/Semicolon.vue'


  onBeforeMount(() => {
    document.body.className = 'hello'
  })
</script>

<template>
  <div class="container">
    <Semicolon title='about.'></Semicolon>
    <div class="subtitle">
      <p>notle is yet another note-taking app.</p>
      <p>a note-taking app that might not be for you.</p>
      <p>it will have a very minimalistic design and strange features.</p>
      <router-link :to="{ name: 'Nav' }">heyy.</router-link>
    </div>
  </div>

</template>

<style scoped>
  .container {
    margin: 2rem 0rem;
  }

  a {
    color: #555555;
    background-color: #f7f7f7;
    text-decoration: None;
    padding: 0.5vh;
    border-radius: 0.5vh;
    text-align: center;
    position: absolute;
    margin-top: 1vh;
  }

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
    width: 28vh;
  }

  .semicolon {
    height: 90vh;
    width: auto;
  }
</style>
