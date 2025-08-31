import { Link } from '@/types'
import type { Attempts } from '@/types'
import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import { trans } from '@common/modules/trans'
import { getFromStorage } from '@common/modules/storage/getFromStorage'
import { saveToStorage } from '@common/modules/storage/saveToStorage'
import { error } from '@common/modules/error'
import { showToast } from '@common/modules/showToast'

export const useAppStore = defineStore('app', () => {
    // It stores copied or cut links
    const linkBuffer = ref<Link | null>(null)

    return {
        linkBuffer,
    }
})
