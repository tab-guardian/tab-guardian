import type { Attempts } from '@common/types'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { logger, trans } from '@common/modules'
import { runtime } from '@common/modules/runtime'
import { config } from '@common/config'

type Attempt = { success: false; error: string } | { success: true; error: null }

export const useAttemptsStore = defineStore('attempts', () => {
    const attempts = ref<Attempts>({
        amount: 0,
        lockEndTime: 0,
        isLocked: false,
    })

    const isLocked = computed<boolean>(() => attempts.value.isLocked)

    const isLockExpired = computed<boolean>(() => {
        return Date.now() >= attempts.value.lockEndTime
    })

    const hasNoAttempts = computed<boolean>(() => {
        return attempts.value.amount >= config.PASS_MAX_ATTEMPTS
    })

    async function loadAttemptsFromStorage(): Promise<void> {
        const attemptsValue = await runtime.storage.get<Attempts>('attempts')

        if (attemptsValue) {
            attempts.value = attemptsValue
        }
    }

    async function save(): Promise<void> {
        if (!attempts.value) {
            logger().error('"attempts.value" is not set in "save" function')
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

        await increment()

        // Lock attempts if at the last attempt but still
        // allow to make it. If they are on the 5th attempt,
        // we lock it but allow to do the 5th attempt
        if (hasNoAttempts.value) {
            await lock()
        }

        return { success: true, error: null }
    }

    async function increment(): Promise<void> {
        attempts.value.amount++
        await save()
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
        attempts.value.lockEndTime =
            Date.now() + config.PASS_LOCK_DURATION * 60 * 1000
        await save()
    }

    async function unlock(): Promise<void> {
        attempts.value.amount = 0
        attempts.value.isLocked = false
        await save()
    }

    return {
        isLocked,
        loadAttemptsFromStorage,
        isLockedErrorMessage,
        makeAttempt,
        unlock,
    }
})
