import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import App from '@settings/App.vue'

createApp(App).use(createPinia()).use(PrimeVue).mount('#tab-guardian-settings')
