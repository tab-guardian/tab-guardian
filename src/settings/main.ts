import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@settings/App.vue'
import '@settings/style.css'
import 'tippy.js/dist/tippy.css'
import 'sweetalert2/src/sweetalert2.scss'
import VueTippy from 'vue-tippy'

createApp(App).use(createPinia()).use(VueTippy).mount('#tab-guardian-settings')
