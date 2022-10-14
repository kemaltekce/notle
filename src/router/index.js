import { createRouter, createWebHashHistory } from 'vue-router'

import Hello from '../views/Hello.vue'
import About from '../views/About.vue'
import Nav from '../views/Nav.vue'
import Page from '../views/Page.vue'
import NotFound from '../views/NotFound.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', name: 'Hello', component: Hello},
  { path: '/:id', name: 'Page', component: Page, props: true},
  { path: '/nav', name: 'Nav', component: Nav },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/about', name: 'About', component: About },
  { path: '/notfound', name : 'NotFound', component: NotFound}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
