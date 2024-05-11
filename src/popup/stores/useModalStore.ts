import type { Modals } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modalStore', () => {
    const modals = ref<Modals>({
        settings: false,
        group: false,
        selectTabs: false,
    })

    function closeAllModals(): void {
        for (const key in modals.value) {
            modals.value[key as keyof Modals] = false
        }
    }

    function openModal(key: keyof Modals): void {
        modals.value[key] = true
    }

    function closeModal(key: keyof Modals): void {
        modals.value[key] = false
    }

    function isOpenModal(key: keyof Modals): boolean {
        return modals.value[key]
    }

    return {
        openModal,
        closeModal,
        closeAllModals,
        isOpenModal,
    }
})