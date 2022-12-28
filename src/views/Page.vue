<script setup>
  import { computed, inject, onMounted, ref, watch } from "vue"
  import { useRouter, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'
  import _ from 'lodash'

  import Bullet from "../components/Bullet.vue"

  import focus from "../utils/focus"
  import blur from "../utils/blur"
  import setCaretToEnd from "../utils/setCaretToEnd"
  import setRootColor from '../utils/setRootColor'
  import setFont from '../utils/setFont'


  const props = defineProps({
    id: String,
  })
  const router = useRouter()
  const page = inject('page')
  const bullet = inject('bullet')
  const setting = inject('setting')

  const bulletElement = ref(null)
  const title = ref(null)
  const isFocusMode = ref(false)
  // styles
  const theme = setting.theme.value
  // varialbes for the modal
  const displayModal = ref(null)
  const modal = ref(null)

  let currentPage = computed(() => {
    return page.getById(props.id)
  })
  let menuTitle = computed(() => {
    if (setting.name.value) {
      return 'heyy ' + setting.name.value + '.'
    }
    return 'heyy.'
  })

  let bullets = computed({
    get() {
        // return empty array if page doesn't exist.
        // code will route to 404 in next steps
        if (!currentPage.value.id) {
          return []
        }
        return JSON.parse(
          JSON.stringify(bullet.getPageBullets(currentPage.value.id)))
    },
    set(value) {
      bullet.updatePageBullets({
        'page_id': currentPage.value.id,
        'bullets': value})
    }
  })

  watch(page.editModeBulletID, async (newBulletID, oldBulletID) => {
    // only run code if focus mode is active
    if (!isFocusMode.value) {return}
    if (oldBulletID && _.hasIn(bulletElement.value.CompleteBulletElements, oldBulletID)) {
      bulletElement.value.CompleteBulletElements[oldBulletID].style.color = 'currentColor'
    }
    if (newBulletID) {
      bulletElement.value.CompleteBulletElements[newBulletID].style.color = '#555555'
    }
  })

  function toNotFoundIfMissingPage(page) {
    // TODO install lodash and use _.isEmpty(page)
    if (Object.keys(page).length === 0) {
      router.push({name: 'NotFound'})
    }
  }

  onMounted(() => {
    toNotFoundIfMissingPage(currentPage.value)
    page.setCurruntPageID(currentPage.value.id)
    setRootColor(theme.mainColor)
    setFont(theme.fontFamily, theme.fontSize)
    document.addEventListener('mousedown', deactivateEditMode)
    document.addEventListener('keydown', processKeyPress)
  })
  onBeforeRouteUpdate((to, from) => {
    toNotFoundIfMissingPage(page.getById(to.params.id))
    page.setCurruntPageID(to.params.id)
  })
  onBeforeRouteLeave(() => {
    document.removeEventListener('mousedown', deactivateEditMode)
    document.removeEventListener('keydown', processKeyPress)
  })

  function deactivateEditMode(e) {
    // keep cmdbar active if it is clicked. Bullet is still being edited.
    // Only close it if click on other area
    if ((!e.target.classList.contains('cmd__text')) && (!e.target.classList.contains('cmd'))) {
      page.setEditModeBulletID(null)
    }
  }

  function setFocusModeColor(bullet) {
    if (isFocusMode.value) {
      bullet.style.color = '#555555'
    }
  }

  function processKeyPress(e) {
    // esc to close edit mode or pro modal
    if (e.keyCode === 27) {
      // close edit mode if at title
      if (e.target.classList.contains('page__title')) {
        e.target.blur()
        return
      }
      // close edit mode if at bullet
      if (page.editModeBulletID.value) {
        blur(bulletElement.value.CompleteBulletElements[page.editModeBulletID.value])
        page.setEditModeBulletID(null)
        return
      }
      // close pro modal
      if (displayModal.value) {
        displayModal.value = null
      }
      return
    }

    // don't process key presses if in edit mode
    if (page.editModeBulletID.value) {
      return
    }
    // don't process key presses if focused on title
    if (e.srcElement.classList.contains('page__title')) {
      return
    }

    e.preventDefault()

    // navigate modal
    if (displayModal.value) {
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

    // enter to activate edit mode
    if (e.keyCode === 13) {
      const bulletID = bullets.value[0].id
      focus(bulletElement.value.CompleteBulletElements[bulletID])
      page.setEditModeBulletID(bulletID)
      return
    }

    // b to go back to nav
    if (e.keyCode === 66) {
      router.push({ name: 'Nav'})
    }

    // u to toggle focus mode on and off
    if (e.keyCode === 85) {
      toggleFocusMode()
    }

    // open pro tips on p key
    if (e.keyCode === 80) {
      if (displayModal.value) {
        displayModal.value = null
        return
      }
      displayModal.value = getModalProTipsData()
    }
  }

  function updatePageBullets(newBullets) {
    bullets.value = newBullets
  }

  function updateText(payload) {
    bullet.updateBulletText(currentPage.value.id, payload.bulletIDs, payload.text)
  }

  function changeToggle(payload) {
    bullet.changeBulletToggle(currentPage.value.id, payload.bulletIDs, payload.toggled)
  }

  async function addNewBulletToPage(payload) {
    const newBulletID = await bullet.addNewBullet(currentPage.value.id, payload.bulletIDs)
    const newBullet = bulletElement.value.CompleteBulletElements[newBulletID]
    focus(newBullet)
  }

  function updatePageTitle(e) {
    page.updateTitle(currentPage.value.id, e.target.innerText)
  }

  function focusOnfirstBullet() {
    const firstBulletID = bullets.value[0].id
    const firstBullet = bulletElement.value.CompleteBulletElements[firstBulletID]
    focus(firstBullet)
  }

  async function indentBulletToSibling(payload) {
    const indentedBulletID = await bullet.indentBullet(currentPage.value.id, payload.bulletIDs)
    const indentedBullet = bulletElement.value.CompleteBulletElements[indentedBulletID]
    focus(indentedBullet)
    setFocusModeColor(indentedBullet)
  }

  async function unindentBulletToParent(payload) {
    const unindentedBulletID = await bullet.unindentBullet(currentPage.value.id, payload.bulletIDs)
    const unindentedBullet = bulletElement.value.CompleteBulletElements[unindentedBulletID]
    focus(unindentedBullet)
    setFocusModeColor(unindentedBullet)
  }

  async function removeBulletStyle(payload) {
    bullet.removeStyle(currentPage.value.id, payload.bulletIDs, payload.text)
  }

  async function removeBullet(payload) {
    // if it is the last bullet on the page don't remove it
    if ((bullets.value.length === 1) & (bullets.value[0].bullets.length === 0)) {
      return
    }

    const previousBulletID = await bullet.remove(currentPage.value.id, payload.bulletIDs)
    if (previousBulletID === 'title') {
      moveUpToTitle()
    } else {
      const previousBullet = bulletElement.value.CompleteBulletElements[previousBulletID]
      focus(previousBullet)
    }
  }

  function moveUpToTitle() {
    title.value.focus()
    page.setEditModeBulletID(null)
    setCaretToEnd(title.value)
  }

  function moveUpToPreviousBullet(payload) {
    const previousBulletID = bullet.getPreviousActiveBullet(currentPage.value.id, payload.bulletIDs)
    const previousBullet = bulletElement.value.CompleteBulletElements[previousBulletID]
    focus(previousBullet)
  }

  function moveDownToNextBullet(payload) {
    const nextBulletID = bullet.getNextActiveBullet(currentPage.value.id, payload.bulletIDs)
    const nextBullet = bulletElement.value.CompleteBulletElements[nextBulletID]
    // next bullet might not exist and nextBullet might be null if end of page
    if (nextBullet) {
      focus(nextBullet)
    }
  }

  function getModalProTipsData() {
    return {
      'type': 'pro',
      'title': 'pro tips',
      'tips': [
        {
          'title': 'non-edit mode',
          'tips': [
            {'key': 'enter', 'text': 'focus on first bullet'},
            {'key': 'u', 'text': 'on/off focus mode'},
            {'key': 'b', 'text': 'back to navigation'},
            {'key': 'drag & drop', 'text': 'move bullets around'},
          ]
        },
        {
          'title': 'edit mode',
          'tips': [
            {'key': 'up', 'text': 'move up'},
            {'key': 'down', 'text': 'move down'},
            {'key': 'meta + u', 'text': 'on/off focus mode'},
            {'key': 'esc', 'text': 'remove focus / activate non edit mode'},
          ]
        }
      ]
    }
  }

  function toggleFocusMode(payload) {
    isFocusMode.value = !isFocusMode.value
    if (isFocusMode.value) {
      document.getElementsByClassName('page')[0].style.color = '#dddddd'
      document.getElementsByClassName('menu')[0].style.color = '#dddddd'
      if (payload) {
        bulletElement.value.CompleteBulletElements[payload.bulletID].style.color = '#555555'
      }
    }
    if (!isFocusMode.value) {
      document.getElementsByClassName('page')[0].style.color = 'currentColor'
      document.getElementsByClassName('menu')[0].style.color = 'currentColor'
    }
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
      <router-link :to="{ name: 'Nav' }">{{ menuTitle }}</router-link>
    </div>
    <!-- <div class="menu__title">
      <router-link :to="{ name: 'Nav' }">notle.</router-link>
    </div> -->
    <div class="menu__items">
      <div
        class="menu__items__item"
        :class='{
          "menu__items__item--simple": setting.theme.value.design === "simple",
        }'
        @click="toggleFocusMode()"
      >
        <span v-if="!isFocusMode">focus</span>
        <span v-else>unfocus</span>
      </div>
      <div
        class="menu__items__item"
        :class='{
          "menu__items__item--simple": setting.theme.value.design === "simple",
        }'
        @click="displayModal = getModalProTipsData()"
      >pro</div>
    </div>
  </div>
  <div
    class="page"
    :class='{
      "page--simple": setting.theme.value.design === "simple"
    }'
    oncontextmenu="return false"
  >
    <div
      class="page__title" contenteditable="true" ref="title"
      @blur="updatePageTitle"
      @keydown.enter.exact.prevent="focusOnfirstBullet"
      @keydown.down.exact.prevent="focusOnfirstBullet"
      >{{ currentPage.title }}</div>
    <bullet
      :bullets="bullets"
      :main="true"
      ref="bulletElement"
      @change="updatePageBullets(bullets)"
      @customChange="updatePageBullets(bullets)"
      @updateText="updateText"
      @changeToggle="changeToggle"
      @addNewBulletToPage="addNewBulletToPage"
      @indentBulletToSibling="indentBulletToSibling"
      @unindentBulletToParent="unindentBulletToParent"
      @removeBulletStyle="removeBulletStyle"
      @removeBullet="removeBullet"
      @moveUpToTitle="moveUpToTitle"
      @moveUpToPreviousBullet="moveUpToPreviousBullet"
      @moveDownToNextBullet="moveDownToNextBullet"
      @toggleFocusMode="toggleFocusMode"
      />
      <div class="empty"></div>
  </div>
  <div class="modal" v-if="displayModal">
    <div class="modal__background" @click="displayModal = null"></div>
    <div class="modal__card" ref="modal">
      <div class="modal__content">
        <div class="modal__content__title">{{ displayModal['title'] }}</div>
        <!-- modal for pro tips -->
        <div
          v-if="displayModal['type'] === 'pro'">
          <div
            v-for="tipCategory in displayModal['tips']"
            :key="tipCategory.title"
          >
            <div class="modal__content__options__title">{{ tipCategory.title }}</div>
            <div class="modal__content__options">
              <div
                v-for="tip in tipCategory.tips" :key="tip.key"
                class="modal__content__options__option"
              >
                <span>{{ tip.key }} : </span>{{ tip.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .page {
    max-width: 600px;
    margin: 0rem auto;
    min-height: 100%;
    overflow: hidden;
  }

  .page--simple {
    padding: 1rem 2rem 0rem 2rem;
    border-left: 1px solid currentColor;
    border-right: 1px solid currentColor;
  }

  .page__title {
    font-size: 3rem;
    padding: 6rem 0 1rem 0;
    font-weight: v-bind('theme.titleFontWeight');
    outline: none;
  }

  .menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0rem -1rem;
    /* padding: 0.5rem 0rem; */
    position: fixed;
    width: 100%;
    background-color: v-bind('theme.mainColor');
    z-index: 5;
  }

  .menu--simple {
    border-bottom: 1px solid currentColor;
  }

  .menu__title {
    padding: 0.5rem 1rem;
  }

  .menu__items {
    display: flex;
    flex-direction: row;
  }

  .menu__items__item {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  .menu__items__item--simple {
    border-left: 1px solid currentColor;
  }

  .modal {
    display: flex;
  }

  .modal__background {
    background-color: v-bind('theme.secondColor');
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
    background-color: v-bind('theme.mainColor');
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
    border-bottom: 1px solid currentColor;
    font-weight: v-bind('theme.titleFontWeight');
  }

  .modal__content__options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1.0rem 0rem;
    background-color: #ffffff;
    border-radius: 0.5rem;
  }

  .modal__content__options__title {
    padding: 1rem 0.5rem 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 200;
  }

  .modal__content__options__option {
    font-size: 1.3rem;
    font-weight: 200;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid v-bind('theme.mainColor');
  }

  .modal__content__options__option span {
    font-weight: 400;
  }
</style>
