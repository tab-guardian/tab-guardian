import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@settings/App.vue'
import '@settings/style.css'

createApp(App).use(createPinia()).mount('#tab-guardian-settings')
