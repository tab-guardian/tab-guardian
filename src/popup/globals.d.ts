import { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        __APP_VERSION__: string
    }
}
