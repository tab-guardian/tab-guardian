import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@settings/App.vue'

createApp(App).use(createPinia()).mount('#tab-guardian-settings')
