import type { Popups } from '@common/types/popup'
import { ref } from 'vue'
import { defineStore } from 'pinia'

const defaultEmptyPopup = {
    shown: false,
    dataOnShow: null,
    dataOnHide: null,
    onClose: null,
}

const defaultPopups: Popups = {
    groupMenu: structuredClone(defaultEmptyPopup),
    folderMenu: structuredClone(defaultEmptyPopup),
    confirm: structuredClone(defaultEmptyPopup),
    removeUrlLock: structuredClone(defaultEmptyPopup),
    groupName: structuredClone(defaultEmptyPopup),
    bindGroup: structuredClone(defaultEmptyPopup),
    password: structuredClone(defaultEmptyPopup),
    linkMenu: structuredClone(defaultEmptyPopup),
    newPassword: structuredClone(defaultEmptyPopup),
    chooseEmoji: structuredClone(defaultEmptyPopup),
    chooseImageIcon: structuredClone(defaultEmptyPopup),
    textInput: structuredClone(defaultEmptyPopup),
}

export const usePopupStore = defineStore('popup', () => {
    const popups = ref<Popups>(structuredClone(defaultPopups))

    function hideAll(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups].shown = false
        }
    }

    function show<K extends keyof Popups>(
        key: K,
        data: Popups[K]['dataOnShow'],
    ): Promise<Popups[K]['dataOnHide']> {
        return new Promise(resolve => {
            popups.value[key].shown = true
            popups.value[key].dataOnShow = data

            // Resolve the promise when closed
            popups.value[key].onClose = resolve
        })
    }

    function hide<K extends keyof Popups>(
        key: K,
        onHideData: Popups[K]['dataOnHide'],
    ): void {
        popups.value[key].shown = false
        popups.value[key].dataOnShow = null
        popups.value[key].dataOnHide = null

        const onClose = popups.value[key].onClose

        if (onHideData && onClose) {
            onClose(onHideData)
        }
    }

    function isPopupVisible(key: keyof Popups): boolean {
        return popups.value[key].shown
    }

    function getSharedData<K extends keyof Popups>(key: K): Popups[K]['dataOnShow'] {
        return popups.value[key].dataOnShow
    }

    return {
        popups,
        show,
        hide,
        hideAll,
        getSharedData,
        isPopupVisible,
    }
})
