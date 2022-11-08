<script setup>
  import { computed, inject, onMounted } from "vue"
  import { useRouter, onBeforeRouteUpdate } from 'vue-router'
  import Bullet from "../components/Bullet.vue"


  const props = defineProps({
    id: String,
  })
  const router = useRouter()
  const page = inject('page')
  const bullet = inject('bullet')

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
  })
  onBeforeRouteUpdate((to, from) => {
    toNotFoundIfMissingPage(page.getById(to.params.id))
    page.setCurruntPageID(to.params.id)
  })

  function updatePageBullets(newBullets) {
    bullets.value = newBullets
  }

  function updateText(payload) {
    bullet.updateBulletText(currentPage.value.id, payload.bulletIDs, payload.text)
  }

  function changeToggle(payload) {
    bullet.changeBulletToggle(currentPage.value.id, payload.bulletIDs, payload.toggled)
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
    <div class="page__title" contenteditable="true">{{ currentPage.title }}</div>
    <bullet
      :bullets="bullets"
      :main="true"
      @change="updatePageBullets(bullets)"
      @customChange="updatePageBullets(bullets)"
      @updateText="updateText"
      @changeToggle="changeToggle"
      />
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
