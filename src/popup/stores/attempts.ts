import type { Attempts } from '@/types'
import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'
import { trans } from '@common/modules/trans'
import { getFromStorage } from '@common/modules/storage/getFromStorage'
import { saveToStorage } from '@common/modules/storage/saveToStorage'
import { error } from '@common/modules/error'
import { showToast } from '@common/modules/showToast'

const MAX_ATTEMPTS = 2
const LOCK_DURATION = 2 // in minutes

export const useAttemptsStore = defineStore('attempts', () => {
    const attempts = ref<Attempts>({
        amount: 0,
        lockEndTime: null,
        isLocked: false,
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

        saveToStorage('attempts', attempts.value)
    }

    function isAllowedToTry(): boolean {
        const isLockExpired = Date.now() >= (attempts.value.lockEndTime || 0)

        if (attempts.value.isLocked && isLockExpired) {
            resetAttempts()
        }

        if (attempts.value.isLocked) {
            const durationLeft = Math.ceil(
                (attempts.value.lockEndTime! - Date.now()) / 1000 / 60,
            )

            const msg = trans(
                'many_attempts_next_attempt_in',
                durationLeft.toString(),
            )

            showToast(msg, 'error', 5000)

            return false
        }

        attempts.value.amount++

        if (attempts.value.amount > MAX_ATTEMPTS) {
            attempts.value.isLocked = true
            attempts.value.lockEndTime = Date.now() + LOCK_DURATION * 60 * 1000

            lockedMessageToast()
            saveAttemptsToStorage()

            return false
        }

        saveAttemptsToStorage()

        return true
    }

    function lockedMessageToast(): void {
        const msg = trans('many_attempts_locked_for', LOCK_DURATION.toString())
        showToast(msg, 'error', 5000)
    }

    function incrementAttempts(): void {
        attempts.value.amount++
        attempts.value.lockEndTime = Date.now()

        saveAttemptsToStorage()
    }

    function resetAttempts(): void {
        attempts.value.amount = 0
        attempts.value.isLocked = false
        saveAttemptsToStorage()
    }

    function hasMaxAttempts(): boolean {
        return attempts.value.amount >= MAX_ATTEMPTS
    }

    return {
        hasMaxAttempts,
        lockedMessageToast,
        saveAttemptsToStorage,
        isAllowedToTry,
        resetAttempts,
        incrementAttempts,
    }
})
