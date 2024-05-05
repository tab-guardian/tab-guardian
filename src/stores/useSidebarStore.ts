import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebarStore', () => {
    const isOpen = ref<boolean>(false)

    return {
        isOpen,
    }
})
