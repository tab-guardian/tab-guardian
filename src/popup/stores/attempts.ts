import type { Attempts } from '@common/types'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { trans } from '@common/modules/utils'
import { runtime } from '@common/modules/runtime'
import { env } from '@common/env'

type Attempt = { success: false; error: string } | { success: true; error: null }

export const useAttemptsStore = defineStore('attempts', () => {
    const attempts = ref<Attempts>({
        amount: 0,
        lockEndTime: 0,
        isLocked: false,
    })

    const isLocked = computed<boolean>(() => {
        return attempts.value.isLocked
    })

    const isLockExpired = computed<boolean>(() => {
        return Date.now() >= attempts.value.lockEndTime
    })

    const hasNoAttempts = computed<boolean>(() => {
        return attempts.value.amount >= env.PASS_MAX_ATTEMPTS
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

    async function makeAttempt(): Promise<Attempt> {
        if (isLocked.value && isLockExpired.value) {
            await unlock()
        }

        if (hasNoAttempts.value) {
            await lock()

            return {
                success: false,
                error: isLockedErrorMessage(),
            }
        }

        attempts.value.amount++
        await saveAttemptsToStorage()

        return { success: true, error: null }
    }

    function isLockedErrorMessage(): string {
        const durationLeft = Math.ceil(
            (attempts.value.lockEndTime - Date.now()) / 1000 / 60,
        )

        return trans('many_attempts_next_attempt_in', durationLeft.toString())
    }

    async function lock(): Promise<void> {
        if (isLocked.value) {
            return
        }

        attempts.value.isLocked = true
        attempts.value.lockEndTime = Date.now() + env.PASS_LOCK_DURATION * 60 * 1000
        await saveAttemptsToStorage()
    }

    async function unlock(): Promise<void> {
        attempts.value.amount = 0
        attempts.value.isLocked = false
        await saveAttemptsToStorage()
    }

    return {
        isLocked,
        loadAttemptsFromStorage,
        isLockedErrorMessage,
        makeAttempt,
        unlock,
    }
})
