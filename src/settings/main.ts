import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@settings/router'
import '@settings/style.css'
import 'tippy.js/dist/tippy.css'
import 'sweetalert2/src/sweetalert2.scss'
import VueTippy from 'vue-tippy'
import App from '@settings/App.vue'

createApp(App)
    .use(createPinia())
    .use(router)
    .use(VueTippy)
    .mount('#tab-guardian-settings')
