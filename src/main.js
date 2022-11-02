import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import page from "./stores/page"
import bullet from "./stores/bullet"

const app = createApp(App)
app.use(router)
app.provide('page', page)
app.provide('bullet', bullet)
app.mount('#app')
