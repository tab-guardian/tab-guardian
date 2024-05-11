import type { Popups } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePopupStore = defineStore('popupStore', () => {
    const popups = ref<Popups>({
        groupModalMenu: false,
        deleteGroup: false,
    })

    function closeAll(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups] = false
        }
    }

    function open(key: keyof Popups): void {
        popups.value[key] = true
    }

    function close(key: keyof Popups): void {
        popups.value[key] = false
    }

    function isOpen(key: keyof Popups): boolean {
        return popups.value[key]
    }

    return {
        open,
        close,
        closeAll,
        isOpen,
    }
})