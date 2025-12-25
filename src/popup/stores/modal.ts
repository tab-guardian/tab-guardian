import type { Modals } from '@common/types/modal'
import { ref } from 'vue'
import { defineStore } from 'pinia'

const defaultEmptyModal = {
    shown: false,
    dataOnShow: null,
    dataOnHide: null,
    onClose: null,
}

const defaultModals: Modals = {
    groupMenu: structuredClone(defaultEmptyModal),
    folderMenu: structuredClone(defaultEmptyModal),
    confirm: structuredClone(defaultEmptyModal),
    removeUrlLock: structuredClone(defaultEmptyModal),
    bindGroup: structuredClone(defaultEmptyModal),
    password: structuredClone(defaultEmptyModal),
    linkMenu: structuredClone(defaultEmptyModal),
    newPassword: structuredClone(defaultEmptyModal),
    chooseEmoji: structuredClone(defaultEmptyModal),
    chooseImageIcon: structuredClone(defaultEmptyModal),
    textInput: structuredClone(defaultEmptyModal),
}

export const useModalStore = defineStore('modal', () => {
    const modals = ref<Modals>(structuredClone(defaultModals))

    function hideAll(): void {
        for (const key in modals.value) {
            modals.value[key as keyof Modals].shown = false
        }
    }

    function show<K extends keyof Modals>(
        key: K,
        data: Modals[K]['dataOnShow'],
    ): Promise<Modals[K]['dataOnHide']> {
        return new Promise(resolve => {
            modals.value[key].shown = true
            modals.value[key].dataOnShow = data

            // Resolve the promise when closed
            modals.value[key].onClose = resolve
        })
    }

    function hide<K extends keyof Modals>(
        key: K,
        onHideData: Modals[K]['dataOnHide'],
    ): void {
        modals.value[key].shown = false
        modals.value[key].dataOnShow = null
        modals.value[key].dataOnHide = null

        const onClose = modals.value[key].onClose

        if (onHideData && onClose) {
            onClose(onHideData)
        }
    }

    function isModalVisible(key: keyof Modals): boolean {
        return modals.value[key].shown
    }

    function getSharedData<K extends keyof Modals>(key: K): Modals[K]['dataOnShow'] {
        return modals.value[key].dataOnShow
    }

    return {
        modals,
        show,
        hide,
        hideAll,
        getSharedData,
        isModalVisible,
    }
})
