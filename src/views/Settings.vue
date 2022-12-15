<script setup>
import { inject, onMounted, onUpdated } from "vue"

import setRootColor from "../utils/setRootColor"
import setFont from "../utils/setFont"

const setting = inject('setting')
const designClass = setting.theme.value.design


onUpdated(() => {
  setRootColor(setting.theme.value.mainColor)
  setFont(setting.theme.value.fontFamily, setting.theme.value.fontSize)
})

onMounted(() => {
  setRootColor(setting.theme.value.mainColor)
  setFont(setting.theme.value.fontFamily, setting.theme.value.fontSize)
})


function updateName(e) {
  setting.setName(e.target.innerText)
}

function blurInput(e) {
  e.target.blur()
}

function focusInput(e) {
  e.target.focus()
}

function updateStyle(newStyle) {
  setting.setStyle(newStyle)
}

function updateColor(newColor) {
  setting.setColor(newColor)
}

function updateTitle(newTitle) {
  setting.setTitle(newTitle)
}

function updateFont(newFont) {
  setting.setFont(newFont)
}

function updateDesign(newDesign) {
  setting.setDesign(newDesign)
}
</script>

<template>
  <div
    class="menu"
    :class='{
      "menu--simple": setting.theme.value.design === "simple",
    }'
  >
    <div class="menu__title">
      <router-link :to="{ name: 'Nav' }">notle.</router-link>
    </div>
    <div class="menu__title">
      <router-link :to="{ name: 'Nav' }">back.</router-link>
    </div>
  </div>
  <div
    class="settings"
    :class='{
      "settings--simple": setting.theme.value.design === "simple"
    }'
    oncontextmenu="return false"
  >
    <div class="settings__title">settings.</div>
    <div
      class="settings__options"
      :class='{
        "settings__options--simple": setting.theme.value.design === "simple",
        "settings__options--retro": setting.theme.value.design === "retro",
        "settings__options--card": setting.theme.value.design === "card",
        }'
    >
      <div class="settings__options__text">
        <div class="settings__options__name">name</div>
        <div class="settings__options__setting">
          <div
            class="settings__options__text__input" contenteditable="true"
            @blur="updateName"
            @mousedown="focusInput"
            @keydown.enter.prevent="blurInput"
            >{{ setting.name.value }}</div>
        </div>
      </div>
      <div
        class="settings__options__switch"
        :class='{
          "settings__options__switch--retro": setting.theme.value.design === "retro",
          "settings__options__switch--card": setting.theme.value.design === "card",
        }'
      >
        <div class="settings__options__name">style</div>
        <div class="settings__options__setting">
          <div
            v-for="(value, key) in setting.styleOptions" :key="key"
            :class='{"settings__options__switch--active": key === setting.style.value}'
            @click="updateStyle(key)"
            >{{ key }}</div>
        </div>
      </div>
      <div class="settings__options__select">
        <div class="settings__options__name">color</div>
        <div class="settings__options__setting">
          <div
            v-for="(value, key) in setting.colorOptions" :key="key"
            :class='{"settings__options__select--active": key === setting.color.value}'
            @click="updateColor(key)"
            >{{ key }}</div>
        </div>
      </div>
      <div
        class="settings__options__switch"
        :class='{
          "settings__options__switch--retro": setting.theme.value.design === "retro",
          "settings__options__switch--card": setting.theme.value.design === "card",
        }'
      >
        <div class="settings__options__name">heyy title</div>
        <div class="settings__options__setting">
          <div
            v-for="(value, key) in setting.titleOptions" :key="key"
            :class='{"settings__options__switch--active": key === setting.title.value}'
            @click="updateTitle(key)"
            >{{ key }}</div>
        </div>
      </div>
      <div class="settings__options__select">
        <div class="settings__options__name">font</div>
        <div class="settings__options__setting">
          <div
            v-for="(value, key) in setting.fontOptions" :key="key"
            :class='{"settings__options__select--active": key === setting.font.value}'
            @click="updateFont(key)"
            >{{ key }}</div>
        </div>
      </div>
      <div class="settings__options__select">
        <div class="settings__options__name">design</div>
        <div class="settings__options__setting">
          <div
            v-for="(value, key) in setting.designOptions" :key="key"
            :class='{"settings__options__select--active": key === setting.design.value}'
            @click="updateDesign(key)"
            >{{ key }}</div>
        </div>
      </div>
    </div>
    <div class="empty"></div>
  </div>

</template>

<style scoped>
  .settings {
    max-width: 600px;
    margin: 0rem auto;
    min-height: 100%;
    overflow: hidden;
  }

  .settings--simple {
    padding: 1rem 2rem 0rem 2rem;
    border-left: 1px solid #555555;
    border-right: 1px solid #555555;
  }

  .settings__title {
    font-size: 3rem;
    padding: 6rem 0 3rem 0;
    font-weight: v-bind('setting.theme.value.titleFontWeight');
    outline: none;
  }

  .settings__options {
    border-top: 2px solid #555555;
  }

  .settings__options--simple > div {
    border-bottom: 1px solid #555555;
    padding: 1rem 0;
  }

  .settings__options--retro > div {
    border: 1px solid #555555;
    margin: 1rem 0rem;
    border-radius: 0.5rem;
    padding: 1rem 1rem;
    box-shadow: 0 0.3rem #555555;
  }

  .settings__options--card > div {
    margin: 1rem 0rem;
    border-radius: 0.5rem;
    padding: 1rem 1rem;
    /* box-shadow: 0 0 0.4rem -0.2rem #555555; */
    background-color: #fefefe;
  }

  .settings__options__name {
    font-weight: 600;
  }

  .settings__options__setting {
    align-self: flex-end;
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }

  .settings__options__switch--active {
    background-color: #555555;
    color:#F7F7F7
  }

  .settings__options__select--active {
    /* text-decoration: underline; */
    border-bottom: 2px solid #555555;
  }

  .settings__options__text, .settings__options__switch, .settings__options__select {
    display: flex;
    flex-direction: column;
  }

  .settings__options__switch, .settings__options__select {
    cursor: pointer;
  }

  .settings__options__select .settings__options__setting div{
    padding: 0 1rem;
  }

  .settings__options__switch .settings__options__setting div{
    border: 1px solid #555555;
    padding: 0.2rem 1rem;
  }

  .settings__options__switch--retro .settings__options__setting div{
    border: 1px solid #555555;
    padding: 0.2rem 1rem;
    border-radius: 0.3rem;
    margin: 0 0.2rem;
  }

  .settings__options__switch--card .settings__options__setting div{
    border: 1px solid #555555;
    padding: 0.2rem 1rem;
    border-radius: 0.3rem;
    margin: 0 0.2rem;
  }

  .settings__options__text__input {
    outline: none;
    min-width: 1px;
    cursor: text;
  }

  .settings__options__text__input:empty:not(:focus):after {
    content: '...';
    color: #55555550;
  }

  .menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0rem -1rem;
    /* padding: 0.5rem 0rem; */
    position: fixed;
    width: 100%;
    background-color: v-bind('setting.theme.value.mainColor');
    z-index: 5;
  }

  .menu--simple {
    border-bottom: 1px solid #555555;
  }

  .menu--card {
    box-shadow: 0 0 0.4rem -0.2rem #555555;
    background-color: #fefefe;
    padding: 0.5rem 0;
  }

  .menu__title {
    padding: 0.5rem 1rem;
  }
</style>
