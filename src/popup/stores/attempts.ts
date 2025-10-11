import type { Attempts } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { trans } from '@common/modules/utils'
import { runtime } from '@common/modules/runtime'
import { showToast } from '@common/modules/toast'
import { env } from '@common/env'

export const useAttemptsStore = defineStore('attempts', () => {
    const attempts = ref<Attempts>({
        amount: 0,
        lockEndTime: null,
        isLocked: false,
    })

    async function loadAttemptsFromStorage(): Promise<void> {
        const attemptsValue = await runtime.storage.get<Attempts>('attempts')

        if (attemptsValue) {
            attempts.value = attemptsValue
        }
    }

    async function saveAttemptsToStorage(): Promise<void> {
        if (!attempts.value) {
            console.error('Attempts value is not set')
            return
        }

        await runtime.storage.set('attempts', attempts.value)
    }

    async function incrementAttempts(): Promise<void> {
        attempts.value.amount++
        await saveAttemptsToStorage()
    }

    async function isAllowedToTry(): Promise<boolean> {
        const isLockExpired = Date.now() >= (attempts.value.lockEndTime || 0)

        if (attempts.value.isLocked && isLockExpired) {
            await resetAttempts()
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

        if (attempts.value.amount > env.PASS_MAX_ATTEMPTS) {
            attempts.value.isLocked = true
            attempts.value.lockEndTime =
                Date.now() + env.PASS_LOCK_DURATION * 60 * 1000

            lockedMessageToast()

            await saveAttemptsToStorage()

            return false
        }

        await saveAttemptsToStorage()

        return true
    }

    function lockedMessageToast(): void {
        const msg = trans(
            'many_attempts_locked_for',
            env.PASS_LOCK_DURATION.toString(),
        )
        showToast(msg, 'error', 5000)
    }

    async function resetAttempts(): Promise<void> {
        attempts.value.amount = 0
        attempts.value.isLocked = false
        await saveAttemptsToStorage()
    }

    function hasMaxAttempts(): boolean {
        return attempts.value.amount >= env.PASS_MAX_ATTEMPTS
    }

    return {
        incrementAttempts,
        hasMaxAttempts,
        lockedMessageToast,
        saveAttemptsToStorage,
        isAllowedToTry,
        resetAttempts,
    }
})
