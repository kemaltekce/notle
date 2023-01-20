<script setup>
  import { defineExpose, ref, onMounted } from "vue"


  const emit = defineEmits(['runCmd'])

  const cmds = [
    {'name': 'indent', 'icon': '&#x22A2'},
    {'name': 'unindent', 'icon': '&#x22A3'},
    {'name': 'bold', 'icon': '#'}
  ]

  const cmdbar = ref(null)

  function runCmd(name) {
    emit('runCmd', {name})
  }

  // the position of the cmdbar is supposed to be fixed. But fixed is not
  // working on mobile because of the difference in visual viewports. So instead
  // of having it being fixed, we place it in absolute with respect to the
  // bullet. Change this if something like device-fixed gets implemented by css.
  function detectMobile() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      cmdbar.value.style.position = 'absolute'
      cmdbar.value.style.bottom = '-' + (cmdbar.value.clientHeight + 3) + 'px'
      cmdbar.value.style.left = '20%'
      cmdbar.value.style.width = '80%'
    }
  }

  onMounted(() => {
    detectMobile()
  })
</script>

<template>
  <div class="cmdbar" ref="cmdbar">
    <div
      v-for="cmd in cmds" :key="cmd.name"
      class="cmd"
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
