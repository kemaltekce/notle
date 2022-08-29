<script setup>
  import { useRouter } from "vue-router";
  import Semicolon from '../components/Semicolon.vue'


  const router = useRouter()

  function goBack() {
    router.go(-2)
  }

  function goNav() {
    router.push({name: 'Nav'})
  }
</script>

<template>
  <Semicolon title='404.'></Semicolon>
  <div class="subtitle">
    <div>
      <p>page not found.</p>
    </div>
    <div>
      <a @click="goBack">go back</a>
    </div>
    <div>
      <a @click="goNav">go to nav</a>
    </div>
  </div>
</template>

<style scoped>
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

  .subtitle {
    letter-spacing: 0.2em;
    position: absolute;
    top: 42vh;
    color: #f7f7f7;
    padding-left: 2vh;
    font-size: 1.5vh;
    width: 28vh;
    display: flex;
    flex-direction: column;
    gap: 4vh;
  }
</style>
