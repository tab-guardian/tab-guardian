import type { Group } from '@/types'
import { ScreenName } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useScreenStore = defineStore('screenStore', () => {
    const screen = ref<ScreenName>(ScreenName.Main)
    const selectedGroup = ref<Group | null>(null)

    return {
        screen,
        selectedGroup,
    }
})
