<script setup>
  import { defineExpose } from "vue"


  const emit = defineEmits(['runCmd'])

  const cmds = [
    {'name': 'indent', 'icon': '&#x22A2'},
    {'name': 'unindent', 'icon': '&#x22A3'},
  ]

  function runCmd(name) {
    emit('runCmd', {name})
  }
</script>

<template>
  <div class="cmdbar">
    <div
      v-for="cmd in cmds" :key="cmd.name"
      class="cmd"
      @click="runCmd(cmd.name)"
      >
      <div class="cmd__text"
        v-html="cmd.icon"
        @click="runCmd(cmd.name)"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
  .cmdbar {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    background-color: #F7F7F7;
    box-shadow: 0px 2px 5px #d0c8c0;
    display: flex;
    overflow: auto;
    color: #555555;
    z-index: 100;
    min-height: 1.7rem;
  }

  .cmd {
    border-right: 1px solid #555555;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .cmd__text {
    font-size: 1rem;
    padding: 2px 10px;
    margin: auto;
  }
</style>
