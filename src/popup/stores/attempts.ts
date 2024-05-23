import type { Attempts } from '@/types'
import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'
import getFromStorage from '@common/modules/storage/getFromStorage'
import saveToStorage from '@common/modules/storage/saveToStorage'
import error from '@common/modules/error'

export const useAttemptsStore = defineStore('attempts', () => {
    const attempts = ref<Attempts>({
        value: 0,
        lastTryDate: Date.now(),
    })

    onMounted(loadAttemptsFromStorage)

    async function loadAttemptsFromStorage(): Promise<void> {
        const attemptsValue = await getFromStorage<Attempts>('attempts')

        if (attemptsValue) {
            attempts.value = attemptsValue
        }
    }

    function saveAttemptsToStorage(): void {
        if (!attempts.value) {
            error.err('Attempts value is not set')
            return
        }

        saveToStorage('attempts', attempts.value.toString())
    }

    function resetAttempts(): void {
        attempts.value.value = 0
        saveAttemptsToStorage()
    }

    return {
        saveAttemptsToStorage,
        resetAttempts,
    }
})
