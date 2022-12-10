import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import page from "./stores/page"
import bullet from "./stores/bullet"
import setting from './stores/setting'


const app = createApp(App)
app.use(router)
app.provide('page', page)
app.provide('bullet', bullet)
app.provide('setting', setting)
app.mount('#app')
