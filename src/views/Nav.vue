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
  // varialbes for the modal
  const displayModal = ref(null)
  const modal = ref(null)
  // variables for the delete div via touch
  const moveTouch = ref(false)
  const deleteWidth = ref(0)
  const deleteWidthStart = ref(0)
  const deleteWidthCurrent = ref(0)
  const deletePageID = ref(null)
  // variables for touch long press
  var touchTimer;
  const touchDuration = 1000;
  const longTouch = ref(false)
  // styles
  const theme = {
    titleFontWeight: 300,  // 300, 900
    pageFontWeight: 200,  // 200, 600
    modalColor: '#F7F7F7',  // #F7F7F7 #C9D8D8 #E5D7FA
    displayHeyyTitle: true,
    name: '',
  }


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

  // hovering functions
  function hovering(pageID) {
    hoveringPageID.value = pageID
  }

  function removeHovering() {
    if (!hoveringPageID.value && currentPageID.value) {
      page.setCurruntPageID(null)
    }
    hoveringPageID.value = null
  }

  function removeHoveringByTouch(e) {
    if (e.target.id === 'app') {
      removeHovering()
    }
  }

  // modal functions
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

  function getModalQuestionDeleteData(pageID) {
    const index = _.findIndex(page.all, { 'id': pageID })
    return {
      'type': 'question',
      'title': 'delete file',
      'pageID': page.all[index].id,
      'question': 'are you sure you want to delete “' + page.all[index].title + '”?'}
  }

  function getModalEditData(index) {
    return {
      'type': 'edit',
      'title': page.all[index].title,
      'pageID': page.all[index].id
    }
  }

  function getModalProTipsData() {
    return {
      'type': 'pro',
      'title': 'pro tips',
      'tips': [
        // navigation
        {'key': 'up / j', 'text': 'move highlight up'},
        {'key': 'down / k', 'text': 'move highlight down'},
        {'key': 'enter', 'text': 'open highlighted page'},
        {'key': 'esc', 'text': 'remove highlighting / close modal'},
        {'key': 'b', 'text': 'back to current page (highlighted)'},
        {'key': 's', 'text': 'open settings page'},
        // change
        {'key': 'meta + up', 'text': 'move page up'},
        {'key': 'meta + down', 'text': 'move page down'},
        // modal
        {'key': 'e', 'text': 'open edit options'},
        {'key': 'd', 'text': 'delete page'},
        {'key': 'p', 'text': 'open pro tips'},
        // touch
        {'key': 'hold touch', 'text': 'open edit options'},
        {'key': 'swipe left', 'text': 'delete page'},
      ]
    }
  }

  // functions for activating delete via touch
  function getOffsetXMobile(e) {
    return e.targetTouches[0].pageX - e.target.getBoundingClientRect().left
  }

  function getWidthPercentage(e) {
    return (e.target.offsetWidth - getOffsetXMobile(e)) / e.target.offsetWidth * 100
  }

  function activateDelete(e, pageID) {
    if ((deletePageID.value !== pageID) || (deleteWidthStart.value > deleteWidthCurrent.value)) {
      deleteWidthStart.value = getWidthPercentage(e)
    }
    deleteWidthCurrent.value = getWidthPercentage(e)
    deleteWidth.value = deleteWidthCurrent.value - deleteWidthStart.value - 5

    // if delete is active don't allow scrolling
    if (deleteWidth.value > 0) {e.preventDefault()}
    // don't allow negative width
    if (deleteWidth.value < 0) {
      deleteWidth.value = 0}

    deletePageID.value = pageID
    if (deleteWidth.value > 40) {
      displayModal.value = getModalQuestionDeleteData(pageID)
      deactivateDelete()
    }
  }

  function touchMove(e, pageID) {
    if (touchTimer) {clearTimeout(touchTimer)}
    // specify touch type so that touch end can run specific function
    moveTouch.value = true
    // scrolling is happening don't activate delete
    if (!e.cancelable) {return}
    // modal is active, don't still activate delete
    if (displayModal.value) {return}

    activateDelete(e, pageID)
  }

  function deactivateDelete() {
    deleteWidth.value = 0
    deletePageID.value = null
  }

  // functions for long touch and activating edit modal
  function touchStart(pageID) {
    const index = _.findIndex(page.all, { 'id': pageID })
    touchTimer = setTimeout(() => {
      longTouch.value = true
      activateEditModal(index)
    }, touchDuration);
  }

  function touchEnd(pageID) {
    // stops short touches from firing the event
    if (touchTimer) {
      clearTimeout(touchTimer)
    }
    if (longTouch.value) {
        longTouch.value = false
    } else if (moveTouch.value) {
        moveTouch.value = false
        deactivateDelete()
    } else {
      router.push({ name: 'Page', params: { id: pageID} })
    }
  }

  function activateEditModal(pageID) {
    displayModal.value = getModalEditData(pageID)
  }

  // navigation functions
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

  function moveUp(pageID) {
    pagePosition.value = _.findIndex(page.all, { 'id': pageID })
    if (pagePosition.value === 0) {return}
    page.move(pagePosition.value, pagePosition.value - 1)
  }

  function moveDown(pageID) {
    pagePosition.value = _.findIndex(page.all, { 'id': pageID })
    if (pagePosition.value + 1 === page.all.length) {return}
    page.move(pagePosition.value, pagePosition.value + 1)
  }

  function navigate(e) {
    // allow navigating through nav items with arrow keys, enter, and esc
    e.preventDefault()

    // deactivate mouse events
    keyActive.value = true

    // modal navigation
    if (displayModal.value) {
      // esc to close modal
      if (e.keyCode === 27) {
        displayModal.value = null
        return
      }
      // navigate question modal
      if (displayModal.value['type'] === 'question') {
        // y key for yes
        if (e.keyCode === 89) {answerQuestion('yes')}
        // n key for no
        if (e.keyCode === 78) {answerQuestion('no')}
        return
      }
      // navigate edit modal
      if (displayModal.value['type'] === 'edit') {
        // d key for delete
        if (e.keyCode === 68) {
          displayModal.value = getModalQuestionDeleteData(displayModal.value['pageID'])
        }
        // up key for move up
        if (e.keyCode === 38) {
          moveUp(displayModal.value['pageID'])
        }
        // down key for move down
        if (e.keyCode === 40) {
          moveDown(displayModal.value['pageID'])
        }
        return
      }
      // navigate question modal
      if (displayModal.value['type'] === 'pro') {
        // scroll down with down arrow and j
        if ((e.keyCode === 40) || (e.keyCode === 74)) {
          modal.value.scrollTo(
            {'left': modal.value.scrollLeft,
            'top': modal.value.scrollTop + 50,
            'behavior':'smooth'})
        }
        // scroll up with up arrow and k
        if ((e.keyCode === 38) || (e.keyCode === 75)) {
          modal.value.scrollTo(
            {'left': modal.value.scrollLeft,
            'top': modal.value.scrollTop - 50,
            'behavior':'smooth'})
        }
        return
      }
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
      removeHovering()
    }

    // b to go back to current page
    if ((e.keyCode === 66) && (currentPageID.value)) {
      router.push({ name: 'Page', params: { id: currentPageID.value} })
    }

    // remove or d key to delete page
    if ((e.keyCode === 8) || (e.keyCode === 68)) {
      if (hoveringPageID.value && (hoveringPageID.value !== 'button')) {
        displayModal.value = getModalQuestionDeleteData(hoveringPageID.value)
      }
    }

    // activate edit modal via e key
    if (e.keyCode === 69) {
      if (hoveringPageID.value && (hoveringPageID.value !== 'button')) {
        // TODO move find index into getmodaleditdata function
        const index = _.findIndex(page.all, { 'id': hoveringPageID.value })
        displayModal.value = getModalEditData(index)
      }
    }

    // open pro tips on p key
    if (e.keyCode === 80) {
      displayModal.value = getModalProTipsData()
    }

    // open settings with s key
    if (e.keyCode === 83) {
      router.push({ name: 'Settings' })
    }
  }
</script>

<template>
  <div class="menu">
    <div class="menu__title">notle.</div>
    <div class="menu__items">
      <div class="menu__items__item">
        <router-link :to="{ name: 'Settings' }">set</router-link>
      </div>
      <div
        class="menu__items__item"
        @click="displayModal = getModalProTipsData()">pro</div>
    </div>
  </div>
  <div
    class="nav" :class='{"nav--mouse-inactive": keyActive}'
    oncontextmenu="return false">
    <div class="empty"></div>
    <div class="nav__title" v-if="theme.displayHeyyTitle">
      <div class="nav__title__name" v-if="theme.name">{{ theme.name }}</div>
      heyy.</div>
    <div tabindex="0" class="nav__page" v-for="(page, i) in page.all"
      :key="page.id"
      :ref="(el) => (navPageElements[i] = el)"
      @mouseover="hovering(page.id)"
      @mouseleave="hoveringPageID = !keyActive ? null : hoveringPageID"
      @touchstart="touchStart(page.id)"
      @touchmove="touchMove($event, page.id)"
      @touchend="touchEnd(page.id)"
      :class='{"nav__page--hovering": hoveringPageID === page.id}'
      >
      <router-link class="nav__page__link"
        :to="{ name: 'Page', params: { id: page.id} }"
        :class='{"nav__page__link--active": currentPageID === page.id}'>
          {{ page.title }}
      </router-link>
      <div
        class="nav__page__delete"
        :style="{width: deletePageID === page.id ? deleteWidth + '%' : '0%'}">
      </div>
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
    <div class="modal__card" ref="modal">
      <div class="modal__content">
        <div class="modal__content__title">{{ displayModal['title'] }}</div>
        <!-- modal for questions -->
        <div
          class="modal__content__question"
          v-if="displayModal['type'] === 'question'">
            {{ displayModal['question'] }}
        </div>
        <div
          class="modal__content__buttons"
          v-if="displayModal['type'] === 'question'">
          <button
            class="modal__content__buttons__button"
            @click="answerQuestion('yes')">yes (y)</button>
          <button
            class="modal__content__buttons__button"
            @click="answerQuestion('no')">no (n)</button>
        </div>
        <!-- modal for editting -->
        <div
          class="modal__content__options"
          v-if="displayModal['type'] === 'edit'">
          <div
            class="modal__content__options__option"
            @click="displayModal = getModalQuestionDeleteData(displayModal['pageID'])">
              delete (d)
          </div>
          <div
            class="modal__content__options__option"
            @click="moveUp(displayModal['pageID'])">move up (&uarr;)</div>
          <div
            class="modal__content__options__option"
            @click="moveDown(displayModal['pageID'])">move down (&darr;)</div>
        </div>
        <!-- modal for pro tips -->
        <div
          class="modal__content__options"
          v-if="displayModal['type'] === 'pro'">
          <div
            v-for="tip in displayModal['tips']"
            :key="tip.key"
            class="modal__content__options__option"
            ><span>{{ tip.key }} : </span>{{ tip.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .nav {
    max-width: 600px;
    margin: 0rem auto;
    padding: 0rem 2rem;
    border-left: 1px solid #555555;
    border-right: 1px solid #555555;
    min-height: 100%;
  }

  .nav--mouse-inactive {
    pointer-events: none;
  }

  .nav__title {
    font-size: 3.5rem;
    padding: 3rem 0;
    font-weight: v-bind('theme.titleFontWeight');
  }

  .nav__title__name {
    font-size: 1rem;
    font-weight: 300;
    color: #888888;
  }

  .nav__page {
    display: flex;
    font-size: 1.5rem;
    border-bottom: 1px solid #555555;
    outline: none;
    position: relative;
    font-weight: v-bind('theme.pageFontWeight');
    /* remove blue color during long touch on chrome */
    -webkit-tap-highlight-color:  rgba(255, 255, 255, 0);
    /* disable long touch dialog window on ios */
    user-select: none;
    -webkit-user-select: none !important;
  }

  .nav__page__delete {
    position: relative;
    top: 0;
    right: 0;
    height: 100%;
    background-color: #555555;
    z-index: 10;
    position: absolute;
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
    font-weight: v-bind('theme.pageFontWeight');
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
    z-index: 15;
  }

  .modal__card {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    padding-bottom: 1.5rem;
    animation-name: scrollIn;
    animation-duration: 0.5s;
    border-radius: 0.7rem 0.7rem 0 0;
    max-height: 50%;
    overflow: auto;
    z-index: 20;
    background-color: v-bind('theme.modalColor');
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
    border-bottom: 1px solid #555555;
    font-weight: v-bind('theme.titleFontWeight');
  }

  .modal__content__question {
    font-size: 1.3rem;
    font-weight: 200;
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
    font-size: 1rem;
    font-weight: 200;
    color:#555555;
    background-color: v-bind('theme.modalColor');
  }

  .modal__content__buttons__button:hover {
    background-color: #d1d1d180;
  }

  @media screen and (max-width: 400px) {
    .modal__content__buttons {
      flex-direction: column;
    }
  }

  /* .modal__content__options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1.0rem 0rem;
  }

  .modal__content__options__option {
    font-size: 1.3rem;
    font-weight: 100;
    padding: 0.5rem 0rem;
    padding-left: 1rem;
    border-radius: 0.3rem;
    border: 1px solid #555555;
  } */

  .modal__content__options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1.0rem 0rem;
    background-color: #ffffff;
    border-radius: 0.5rem;
  }

  .modal__content__options__option {
    font-size: 1.3rem;
    font-weight: 200;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid v-bind('theme.modalColor');
  }

  .modal__content__options__option span {
    font-weight: 400;
  }

  .empty {
    height: 6rem;
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

  .menu__items {
    display: flex;
    flex-direction: row;
  }

  .menu__items__item {
    border-left: 1px solid #555555;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

</style>
