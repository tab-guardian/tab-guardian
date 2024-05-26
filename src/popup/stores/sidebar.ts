import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
    const isOpen = ref<boolean>(false)

    function toggle(): void {
        isOpen.value = !isOpen.value
    }

    return {
        isOpen,
        toggle,
    }
})
