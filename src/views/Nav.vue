<script setup>
  import { ref, inject, onBeforeMount, onBeforeUpdate } from 'vue'
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
  const displayModal = ref(false)
  const deleteWidth = ref(0)
  const deleteWidthStart = ref(0)
  const deleteWidthCurrent = ref(0)
  const deletePageID = ref(null)


  if (currentPageID.value) {
    hovering(currentPageID.value)
    pagePosition.value = _.findIndex(page.all, { 'id': currentPageID.value })
  }

  onBeforeMount(() => {
    document.body.className = ''
    document.addEventListener('keydown', navigate)
    document.addEventListener('mousemove', activateMouse)
    document.addEventListener('touchstart', removeHoveringByTouch)
  })

  onBeforeUpdate(() => {
    // set to empty list so that removing pages works properly. Otherwise
    // nav index still existed with null element.
    navPageElements.value = []
  })

  onBeforeRouteLeave(() => {
    document.removeEventListener('keydown', navigate)
    document.removeEventListener('mousemove', activateMouse)
    document.removeEventListener('touchstart', removeHoveringByTouch)
  })

  function hovering(pageID) {
    hoveringPageID.value = pageID
  }

  function removeHoveringByTouch(e) {
    if (e.target.id === 'app') {
      if (!hoveringPageID.value && currentPageID.value) {
        page.setCurruntPageID(null)
      }
      hoveringPageID.value = null
    }
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

  function answerQuestion(answer) {
    if (displayModal.value.title === 'delete file') {
      if (answer === 'yes') {
        page.remove(displayModal.value.pageID)
        if (currentPageID.value === displayModal.value.pageID) {
          page.setCurruntPageID(null)
        }
        hoveringPageID.value = null
        displayModal.value = null
      }
      if (answer === 'no') {
        displayModal.value = null
      }
    }
  }

  function getOffsetXMobile(e) {
    return e.targetTouches[0].pageX - e.target.getBoundingClientRect().left
  }
  function getWidthPercentage(e) {
    return (e.target.offsetWidth - getOffsetXMobile(e)) / e.target.offsetWidth * 100
  }
  function activateDelete(e, pageID) {
    if (displayModal.value) {return}
    if ((deletePageID.value !== pageID) || (deleteWidthStart.value > deleteWidthCurrent.value)) {
      deleteWidthStart.value = getWidthPercentage(e)
    }
    deleteWidthCurrent.value = getWidthPercentage(e)
    deleteWidth.value = deleteWidthCurrent.value - deleteWidthStart.value - 5
    if (deleteWidth.value < 0) {
      deleteWidth.value = 0}
    deletePageID.value = pageID
    if (deleteWidth.value > 40) {
      const index = _.findIndex(page.all, { 'id': pageID })
      displayModal.value= {
        'title': 'delete file',
        'pageID': page.all[index].id,
        'question': 'are you sure you want to delete “' + page.all[index].title + '”?'}
      deactivateDelete()
    }
  }
  function deactivateDelete() {
    deleteWidth.value = 0
    deletePageID.value = null
  }

  function navigate(e) {
    // allow navigating through nav items with arrow keys, enter, and esc
    e.preventDefault()

    // deactivate mouse events
    keyActive.value = true

    // modal navigation
    if (displayModal.value) {
      if (e.keyCode === 89) {answerQuestion('yes')}
      if (e.keyCode === 78) {answerQuestion('no')}
      return
    }

    // arrow up or k key for moving focus up
    if ((e.keyCode === 38) || (e.keyCode === 75)) {
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

    // arrow down or j key for moving focus down
    if ((e.keyCode === 40) || (e.keyCode === 74)) {
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

    // esc to remove hovering
    if (e.keyCode === 27) {
      if (!hoveringPageID.value && currentPageID.value) {
        page.setCurruntPageID(null)
      }
      hoveringPageID.value = null
    }

    // b to go back to current page
    if ((e.keyCode === 66) && (currentPageID.value)) {
      router.push({ name: 'Page', params: { id: currentPageID.value} })
    }

    // remove or d key to delete page
    if ((e.keyCode === 8) || (e.keyCode === 68)) {
      if (hoveringPageID.value && (hoveringPageID.value !== 'button')) {
        const index = _.findIndex(page.all, { 'id': hoveringPageID.value })
        displayModal.value= {
          'title': 'delete file',
          'pageID': page.all[index].id,
          'question': 'are you sure you want to delete “' + page.all[index].title + '”?'}
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
      @touchmove="activateDelete($event, page.id)"
      @touchend="deactivateDelete"
      :class='{"nav__page--hovering": hoveringPageID === page.id}'
      >
      <router-link class="nav__page__link"
        :to="{ name: 'Page', params: { id: page.id} }"
        :class='{"nav__page__link--active": currentPageID === page.id}'>
          {{ page.title }}
      </router-link>
      <div class="nav__page__delete" :style="{width: deletePageID === page.id ? deleteWidth + '%' : '0%'}"></div>
    </div>
    <div class="button" ref="button" tabindex="0"
      :class='{"nav__page--hovering": hoveringPageID === "button"}'
      @mouseover="hoveringPageID = 'button'"
      @mouseleave="hoveringPageID = !keyActive ? null : hoveringPageID"
      @click="page.add"
      >+ new page</div>
  </div>
  <div class="modal" v-if="displayModal">
    <div class="modal__background" @click="displayModal = null"></div>
    <div class="modal__card">
      <div class="modal__content">
        <div class="modal__content__title">{{ displayModal['title'] }}</div>
        <div class="modal__content__question">{{ displayModal['question'] }}</div>
        <div class="modal__content__buttons">
          <button class="modal__content__buttons__button" @click="answerQuestion('yes')">yes (y)</button>
          <button class="modal__content__buttons__button" @click="answerQuestion('no')">no (n)</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .nav {
    max-width: 600px;
    margin: 5rem auto;
    padding: 0 2rem;
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
    position: relative;
  }

  .nav__page__delete {
    position: relative;
    top: 0;
    right: 0;
    height: 100%;
    /* width: 0%; */
    background-color: red;
    opacity: 0.5;
    z-index: 10;
    position: absolute;
    /* translate: 100%; */
  }

  .nav__page__link {
    flex: 1;
    padding: 1.5rem 0;
    padding-left: 0.5rem;
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

  .modal {
    display: flex;
  }

  .modal__background {
    background-color: #d1d1d180;
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }

  .modal__card {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    background-color: #F7F7F7;
    padding-bottom: 1.5rem;
    animation-name: scrollIn;
    animation-duration: 0.5s;
    border-radius: 0.7rem 0.7rem 0 0;
  }

  @keyframes scrollIn {
    0% {transform: translateY(100%);}
    100% {transform: translateY(0%);}
  }

  .modal__content {
    max-width: 600px;
    margin: 1.5rem auto;
    padding: 0 2rem;
  }

  .modal__content__title {
    padding: 1.5rem 0.5rem;
    /* margin-bottom: 1.5rem; */
    font-size: 2.0rem;
    font-weight: 100;
    border-bottom: 1px solid #555555;
  }

  .modal__content__question {
    font-size: 1.3rem;
    font-weight: 100;
    padding: 1.5rem 0.5rem;
  }

  .modal__content__buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;;
    flex-direction: row;
  }

  .modal__content__buttons__button {
    flex-grow: 1;
    border: 1px solid #555555;
    border-radius: 0.3rem;
    display: flex;
    justify-content: center;
    padding: 0.3rem 0;
    background-color: #F7F7F7;
    font-size: 1rem;
    font-weight: 100;
  }

  .modal__content__buttons__button:hover {
    background-color: #d1d1d180;
  }

  @media screen and (max-width: 400px) {
    .modal__content__buttons {
      flex-direction: column;
    }
  }
</style>
