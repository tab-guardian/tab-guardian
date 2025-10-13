import type { Popups } from '@common/types/popup'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'

const defaultEmptyPopup = {
    open: false,
    dataOnOpen: null,
    dataOnClose: null,
}

const defaultPopups: Popups = {
    groupMenuView: cloneDeep(defaultEmptyPopup),
    deleteGroup: cloneDeep(defaultEmptyPopup),
    groupName: cloneDeep(defaultEmptyPopup),
    rebindGroup: cloneDeep(defaultEmptyPopup),
    enterPassword: cloneDeep(defaultEmptyPopup),
    linkMenuView: cloneDeep(defaultEmptyPopup),
    newGroupName: cloneDeep(defaultEmptyPopup),
    editGroupName: cloneDeep(defaultEmptyPopup),
    newPassword: {
        open: false,
        dataOnOpen: null,
        dataOnClose: { newPass: '' },
    },
    chooseEmoji: {
        open: false,
        dataOnOpen: null,
        dataOnClose: { emo: '' },
    },
    chooseImageIcon: {
        open: false,
        dataOnOpen: null,
        dataOnClose: { url: '' },
    },
}

export const usePopupStore = defineStore('popup', () => {
    const popups = ref<Popups>(cloneDeep(defaultPopups))
    const onCloseCallback = ref<null | (<T>(data: T) => void)>(null)

    function closeAllPopups(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups].open = false
        }
    }

    function openPopup<K extends keyof Popups>(key: K) {
        popups.value[key].open = true

        return {
            withData(data: Popups[K]['dataOnOpen']) {
                popups.value[key].dataOnOpen = data
            },
            onClose(callback: (data: Popups[K]['dataOnClose']) => void) {
                onCloseCallback.value = callback
            },
        }
    }

    function resetGroups(): void {
        popups.value = cloneDeep(defaultPopups)
    }

    /**
     * @param data Pass data that you want to pass to onClose callback
     */
    function closePopup(key: keyof Popups, data?: any): void {
        popups.value[key].open = false
        popups.value[key].dataOnOpen = null
        popups.value[key].dataOnClose = null

        if (data && onCloseCallback.value) {
            onCloseCallback.value(data)
        }
    }

    function isOpenPopup(key: keyof Popups): boolean {
        return popups.value[key].open
    }

    function getSharedData<K extends keyof Popups>(key: K): Popups[K]['dataOnOpen'] {
        return popups.value[key].dataOnOpen
    }

    return {
        popups,
        openPopup,
        closePopup,
        closeAllPopups,
        getSharedData,
        isOpenPopup,
        resetGroups,
    }
})
