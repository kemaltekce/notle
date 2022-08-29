import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import page from "./stores/page"

const app = createApp(App)
app.use(router)
app.provide('page', page)
app.mount('#app')
