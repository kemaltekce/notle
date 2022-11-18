<script setup>
  import { defineExpose } from "vue"


  const emit = defineEmits(['runCmd'])

  const cmds = [
    {'name': 'indent', 'icon': '&#x21A6'},
    {'name': 'unindent', 'icon': '&#x21A4'},
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
      v-html="cmd.icon"
      @click="runCmd(cmd.name)"
      >
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
  }

  .cmd {
    font-size: 1rem;
    padding: 2px 10px;
    border-right: 1px solid #555555;
    cursor: pointer;
  }
</style>
