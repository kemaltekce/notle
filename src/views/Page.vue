<script setup>
  import { computed, inject, onMounted, ref } from "vue"
  import { useRouter, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'

  import Bullet from "../components/Bullet.vue"

  import focus from "../utils/focus"
  import blur from "../utils/blur"
  import setCaretToEnd from "../utils/setCaretToEnd"


  const props = defineProps({
    id: String,
  })
  const router = useRouter()
  const page = inject('page')
  const bullet = inject('bullet')
  const bulletElement = ref(null)
  const title = ref(null)

  let currentPage = computed(() => {
    return page.getById(props.id)
  })

  let bullets = computed({
    get() {
        return JSON.parse(
          JSON.stringify(bullet.getPageBullets(currentPage.value.id)))
    },
    set(value) {
      bullet.updatePageBullets({
        'page_id': currentPage.value.id,
        'bullets': value})
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

  function processKeyPress(e) {
    // esc to close edit mode
    if (e.keyCode === 27) {
      if (e.target.classList.contains('page__title')) {
        e.target.blur()
        return
      }
      if (page.editModeBulletID.value) {
        blur(bulletElement.value.CompleteBulletElements[page.editModeBulletID.value])
        page.setEditModeBulletID(null)
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
  }

  async function unindentBulletToParent(payload) {
    const unindentedBulletID = await bullet.unindentBullet(currentPage.value.id, payload.bulletIDs)
    const unindentedBullet = bulletElement.value.CompleteBulletElements[unindentedBulletID]
    focus(unindentedBullet)
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
</script>

<template>
  <div class="menu">
    <div class="menu__title">
      <router-link :to="{ name: 'Nav' }">heyy.</router-link>
    </div>
    <div class="menu__title">
      <router-link :to="{ name: 'Nav' }">notle.</router-link>
    </div>
    <div class="menu__items">
      <div class="menu__items__item">set</div>
      <div class="menu__items__item">pro</div>
    </div>
  </div>
  <div class="page" oncontextmenu="return false">
    <div class="empty"></div>
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
      />
      <div class="empty"></div>
  </div>
</template>

<style scoped>
  .page {
    max-width: 600px;
    margin: 0rem auto;
    padding: 0rem 2rem;
    border-left: 1px solid #555555;
    border-right: 1px solid #555555;
    min-height: 100%;
    overflow: hidden;
  }

  .page__title {
    font-size: 3.5rem;
    padding: 3rem 0;
    font-weight: 300;
    outline: none;
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
