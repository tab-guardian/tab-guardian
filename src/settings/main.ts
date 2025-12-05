import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@settings/router'
import '@common/assets/css/globals.css'
import VueTippy from 'vue-tippy'
import App from '@settings/App.vue'

createApp(App)
    .use(createPinia())
    .use(router)
    .use(VueTippy)
    .mount('#tab-guardian-settings')
