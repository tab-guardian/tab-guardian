import { App } from 'vue'

export default {
    install(app: App) {
        app.config.globalProperties.__APP_VERSION__ = 'v' + __APP_VERSION__
    },
}
