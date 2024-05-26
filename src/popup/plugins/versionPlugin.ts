import { App } from 'vue'

export default {
    install(app: App) {
        app.config.globalProperties.APP_VERSION = APP_VERSION
    },
}
