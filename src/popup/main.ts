import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import '@/style.css'
import 'tippy.js/dist/tippy.css'
import VueTippy from 'vue-tippy'

createApp(App)
    .use(createPinia())
    .use(router)
    .use(VueTippy)
    .mount('#tab-guardian-app')
