<script setup>
  import { inject } from 'vue'
  import Semicolon from '../components/Semicolon.vue'


  const page = inject('page')
</script>

<template>
  <Semicolon title='heyy.'></Semicolon>
  <div class="subtitle">
    <div>
      <router-link :to="{ name: 'Hello'}">notle.</router-link>
    </div>
    <div v-for="page in page.all" :key="page.id">
      <router-link :to="{ name: 'Page', params: { id: page.id} }">{{ page.title }}</router-link>
    </div>
    <div>
      <router-link :to="{ name: 'About'}">about.</router-link>
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
    display: flex;
    flex-direction: column;
    gap: 4vh;
  }

  .semicolon {
    height: 90vh;
    width: auto;
  }
</style>
