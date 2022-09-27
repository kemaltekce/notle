<script setup>
  import { computed, onBeforeMount, onMounted, inject } from "vue"
  import { useRouter, onBeforeRouteUpdate } from 'vue-router'


  const props = defineProps({
    id: String,
  })
  const router = useRouter()
  const page = inject('page')

  let currentPage = computed(() => {
    return page.getById(props.id)
  })

  function toNotFoundIfMissingPage(page) {
    // TODO install lodash and use _.isEmpty(page)
    if (Object.keys(page).length === 0) {
      router.push({name: 'NotFound'})
    }
  }

  onBeforeMount(() => {
    document.body.className = 'hello'
  })
  onMounted(() => {
    toNotFoundIfMissingPage(currentPage.value)
    page.setCurruntPageID(currentPage.value.id)
  })
  onBeforeRouteUpdate((to, from) => {
    toNotFoundIfMissingPage(page.getById(to.params.id))
    page.setCurruntPageID(to.params.id)
  })
</script>

<template>
  <div v-if="currentPage">
    <svg class="semicolon" width="100" height="280" viewBox="0 0 100 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#383838"/>
      <rect y="110" width="100" height="100" fill="#383838"/>
      <path d="M0 259.004C0 259.004 32.7643 255.244 43 240.004C49.9196 229.701 50 209.004 50 209.004C50 209.004 88 209.004 100 209.004C100 230.5 89.8164 245.909 72.5 261.004C50.5097 280.173 0 279.004 0 279.004V259.004Z" fill="#383838"/>
    </svg>

    <h1 class="title">{{ currentPage.title }}</h1>
    <div class="subtitle">
      <router-link :to="{ name: 'Nav' }">heyy.</router-link>
    </div>
  </div>
</template>

<style scoped>
  a {
    color: #555555;
    background-color: #f7f7f7;
    text-decoration: None;
    padding: 0.5vh;
    border-radius: 0.5vh;
    text-align: center;
    position: absolute;
    margin-top: 1vh;
  }

  .title {
    letter-spacing: 0.3em;
    position: absolute;
    top: 3vh;
    color: #f7f7f7;
    padding-left: 2vh;
    font-size: 5vh;
    width: 28vh;
  }

  .subtitle {
    letter-spacing: 0.2em;
    position: absolute;
    top: 42vh;
    color: #f7f7f7;
    padding-left: 2vh;
    font-size: 1.5vh;
    width: 28vh;
  }

  .semicolon {
    height: 90vh;
    width: auto;
  }
</style>
