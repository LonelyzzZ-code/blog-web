import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css' // ← 这行引入 Tailwind

createApp(App).use(router).mount('#app')
