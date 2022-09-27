<script setup>
  import { ref, inject, onBeforeMount } from 'vue'
  import { onBeforeRouteLeave, useRouter } from 'vue-router'
  import _ from 'lodash'


  const router = useRouter()
  const page = inject('page')

  const currentPageID = page.currentPageID
  const hoveringPageID = ref(null)
  const pagePosition = ref(null)
  const navPageElements = ref([])
  const button = ref(null)
  const keyActive = ref(false)


  if (currentPageID.value) {
    hovering(currentPageID.value)
    pagePosition.value = _.findIndex(page.all, { 'id': currentPageID.value })
  }

  onBeforeMount(() => {
    document.body.className = ''
    document.addEventListener('keydown', navigate)
    document.addEventListener('mousemove', activateMouse)
  })

  onBeforeRouteLeave(() => {
    document.removeEventListener('keydown', navigate)
    document.addEventListener('mousemove', activateMouse)
  })

  function hovering(pageID) {
    hoveringPageID.value = pageID
  }

  function activateMouse() {
    // activate mouse events
    keyActive.value = false
  }

  function scrollUpTo(el) {
    // only scroll if element not visible
    if (el.getBoundingClientRect().top >= 0) {return}
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY)
  }

  function scrollDownTo(el) {
    // only scroll if element not visible
    if (el.getBoundingClientRect().bottom <= window.innerHeight) {return}
    window.scrollTo(
      0,
      el.getBoundingClientRect().top + window.scrollY - window.innerHeight
      + el.offsetHeight
    )
  }

  function navigate(e) {
    // allow navigating through nav items with arrow keys, enter, and esc
    e.preventDefault()

    // deactivate mouse events
    keyActive.value = true

    // arrow up key for moving focus
    if (e.keyCode === 38) {
      e.preventDefault()
      if ((!hoveringPageID.value) || (hoveringPageID.value === page.all[0].id)) {
        // don't run code if meta key is pressed
        if (e.metaKey || e.shiftKey) {return}
        hovering('button')
        window.scrollTo(0, document.body.scrollHeight)
        return
      }
      if (hoveringPageID.value === 'button') {
        // don't run code if meta key is pressed
        if (e.metaKey || e.shiftKey) {return}
        pagePosition.value = page.all.length - 1
        hovering(page.all[pagePosition.value].id)
        window.scrollTo(0, document.body.scrollHeight)
        return
      }
      pagePosition.value = _.findIndex(page.all, { 'id': hoveringPageID.value })
      // move page along with focus
      if (e.metaKey || e.shiftKey) {
        page.move(pagePosition.value, pagePosition.value - 1)
      }
      pagePosition.value --
      hovering(page.all[pagePosition.value].id)
      if (pagePosition.value - 2 <= 0) {
        window.scrollTo(0, 0)
        return
      }
      if (pagePosition.value + 2 >= navPageElements.value.length) {
        window.scrollTo(0, document.body.scrollHeight)
        return
      }
      scrollUpTo(navPageElements.value[pagePosition.value - 2])
      scrollDownTo(navPageElements.value[pagePosition.value + 2])
    }

    // arrow down key for moving focus
    if (e.keyCode === 40) {
      e.preventDefault()
      if ((!hoveringPageID.value) || (hoveringPageID.value == 'button')) {
        // don't run code if meta key is pressed
        if (e.metaKey || e.shiftKey) {return}
        pagePosition.value = 0
        hovering(page.all[pagePosition.value].id)
        window.scrollTo(0, 0)
        return
      }
      pagePosition.value = _.findIndex(page.all, { 'id': hoveringPageID.value })
      // move page along with focus
      if (e.metaKey || e.shiftKey) {
        page.move(pagePosition.value, pagePosition.value + 1)
      }
      pagePosition.value ++
      if (page.all.length === pagePosition.value) {
        // don't run code if meta key is pressed
        if (e.metaKey || e.shiftKey) {
          pagePosition.value --
          return
        }
        hovering('button')
        window.scrollTo(0, document.body.scrollHeight)
        return
      }
      hovering(page.all[pagePosition.value].id)
      if (pagePosition.value + 2 >= navPageElements.value.length) {
        window.scrollTo(0, document.body.scrollHeight)
        return
      }
      if (pagePosition.value - 2 < 0) {
        window.scrollTo(0, 0)
        return
      }
      // scroll up or down
      scrollUpTo(navPageElements.value[pagePosition.value - 2])
      scrollDownTo(navPageElements.value[pagePosition.value + 2])
    }

    // enter to navitage to focused page
    if (e.keyCode === 13) {
      if (hoveringPageID.value === 'button') {
        page.add()
        window.scrollTo(0, document.body.scrollHeight)
        return
      }
      router.push({ name: 'Page', params: { id: hoveringPageID.value} })
    }

    // esc to go back to current page
    if ((e.keyCode === 27) && (currentPageID.value)) {
      router.push({ name: 'Page', params: { id: currentPageID.value} })
    }

    // remove key to delete page
    if (e.keyCode == 8) {
      if (hoveringPageID.value && (hoveringPageID.value !== 'button')) {
        page.remove(hoveringPageID.value)
        // TODO maybe not null but the next or previous page?
        hoveringPageID.value = null
      }
    }

  }

</script>

<template>
  <div class="nav" :class='{"nav--mouse-inactive": keyActive}'>
    <div class="nav__title">heyy.</div>
    <div tabindex="0" class="nav__page" v-for="(page, i) in page.all"
      :key="page.id"
      :ref="(el) => (navPageElements[i] = el)"
      @mouseover="hovering(page.id)"
      @mouseleave="hoveringPageID = !keyActive ? null : hoveringPageID"
      :class='{"nav__page--hovering": hoveringPageID === page.id}'
      >
      <router-link class="nav__page__link"
        :to="{ name: 'Page', params: { id: page.id} }"
        :class='{"nav__page__link--active": currentPageID === page.id}'>
          {{ page.title }}
      </router-link>
    </div>
    <div class="button" ref="button" tabindex="0"
      :class='{"nav__page--hovering": hoveringPageID === "button"}'
      @mouseover="hoveringPageID = 'button'"
      @mouseleave="hoveringPageID = !keyActive ? null : hoveringPageID"
      @click="page.add"
      >+ new page</div>
  </div>
</template>

<style scoped>
  .nav__page__link {
    flex: 1;
    padding: 1.5rem 0;
    padding-left: 0.5rem;
  }

  .nav {
    max-width: 600px;
    margin: 5rem auto;
  }

  .nav--mouse-inactive {
    pointer-events: none;
  }

  .nav__title {
    font-size: 3.5rem;
    font-weight: 100;
    padding: 3rem 0;
  }

  .nav__page {
    display: flex;
    font-size: 1.5rem;
    font-weight: 100;
    border-bottom: 1px solid #555555;
    outline: none;
  }

  .nav__page__link--active {
    background-color: #d1d1d180;
  }

  .nav__page--hovering {
    background-color: #d1d1d180;
  }

  .button {
    flex: 1;
    font-size: 1.3rem;
    font-weight: 100;
    padding: 1.5rem 0;
    padding-left: 0.5rem;
    cursor: pointer;
    outline: none;
  }

  .button--hovering {
    background-color: #d1d1d180;
  }
</style>
