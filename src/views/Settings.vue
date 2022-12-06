<script setup>
</script>

<template>
  <div class="menu">
    <div class="menu__title">
      <router-link :to="{ name: 'Nav' }">notle.</router-link>
    </div>
    <div class="menu__title">
      <router-link :to="{ name: 'Nav' }">back.</router-link>
    </div>
  </div>
  <div class="settings" oncontextmenu="return false">
    <div class="empty"></div>
    <div class="settings__title">settings.</div>
    <div class="settings__options">
      <div class="settings__options__text">
        <div class="settings__options__name">name</div>
        <div class="settings__options__setting">kemal</div>
      </div>
      <div class="settings__options__switch">
        <div class="settings__options__name">style</div>
        <div class="settings__options__setting">
          <div>light</div>
          <div>bold</div>
        </div>
      </div>
      <div class="settings__options__select">
        <div class="settings__options__name">color</div>
        <div class="settings__options__setting">
          <div>grey</div>
          <div>green</div>
          <div>violet</div>
        </div>
      </div>
      <div class="settings__options__switch">
        <div class="settings__options__name">heyy title</div>
        <div class="settings__options__setting">
          <div>yes</div>
          <div>no</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
  .settings {
    max-width: 600px;
    margin: 0rem auto;
    padding: 0rem 2rem;
    border-left: 1px solid #555555;
    border-right: 1px solid #555555;
    min-height: 100%;
    overflow: hidden;
  }

  .settings__title {
    font-size: 3.5rem;
    padding: 3rem 0;
    font-weight: 300;
    outline: none;
  }

  .settings__options {
    border-top: 2px solid #555555;
  }

  .settings__options > div {
    border-bottom: 1px solid #555555;
    padding: 1rem 0;
  }

  .settings__options__name {
    font-weight: 600;
  }

  .settings__options__setting {
    align-self: flex-end;
    display: flex;
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


  .menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid #555555;
    margin: 0rem -1rem;
    /* padding: 0.5rem 0rem; */
    position: fixed;
    width: 100%;
    background-color: #F7F7F7;
    z-index: 5;
  }

  .menu__title {
    padding: 0.5rem 1rem;
  }
</style>
