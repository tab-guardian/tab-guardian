// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, suite } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAttemptsStore } from '@/stores/attempts'

describe('attemptsStore', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('isLocked', () => {
        it('is false by default', () => {
            const attemptsStore = useAttemptsStore()
            expect(attemptsStore.isLocked).toBeFalsy()
        })
    })

    suite('makeAttempt()', () => {
        it('can do 1 attempt', async () => {
            const attempt = await useAttemptsStore().makeAttempt() // 1
            expect(attempt.success).toBeTruthy()
        })

        it('can do 5 attempts', async () => {
            const attemptsStore = useAttemptsStore()

            await attemptsStore.makeAttempt() // 1
            await attemptsStore.makeAttempt() // 2
            await attemptsStore.makeAttempt() // 3
            await attemptsStore.makeAttempt() // 4
            const attempt = await attemptsStore.makeAttempt() // 5

            expect(attempt.success).toBeTruthy()
        })

        it('cannot do 6 attempts', async () => {
            const attemptsStore = useAttemptsStore()

            await attemptsStore.makeAttempt() // 1
            await attemptsStore.makeAttempt() // 2
            await attemptsStore.makeAttempt() // 3
            await attemptsStore.makeAttempt() // 4
            await attemptsStore.makeAttempt() // 5
            const attempt = await attemptsStore.makeAttempt() // 6 (too many)

            expect(attempt.success).toBeFalsy()
        })

        it('is not locked after 1 attempt', async () => {
            const attemptsStore = useAttemptsStore()
            await attemptsStore.makeAttempt() // 1
            expect(attemptsStore.isLocked).toBeFalsy()
        })

        it('is not locked after 4 attempts', async () => {
            const attemptsStore = useAttemptsStore()

            await attemptsStore.makeAttempt() // 1
            await attemptsStore.makeAttempt() // 2
            await attemptsStore.makeAttempt() // 3
            await attemptsStore.makeAttempt() // 4

            expect(attemptsStore.isLocked).toBeFalsy()
        })

        it('is locked after 5 attempts but attempt is success', async () => {
            const attemptsStore = useAttemptsStore()

            await attemptsStore.makeAttempt() // 1
            await attemptsStore.makeAttempt() // 2
            await attemptsStore.makeAttempt() // 3
            await attemptsStore.makeAttempt() // 4
            const attempt = await attemptsStore.makeAttempt() // 5

            expect(attempt.success).toBeTruthy()
            expect(attemptsStore.isLocked).toBeTruthy()
        })
    })

    suite('unlock()', () => {
        it('removes lock with', async () => {
            const attemptsStore = useAttemptsStore()

            // Lock by making too many attempts
            await attemptsStore.makeAttempt() // 1
            await attemptsStore.makeAttempt() // 2
            await attemptsStore.makeAttempt() // 3
            await attemptsStore.makeAttempt() // 4
            await attemptsStore.makeAttempt() // 5
            await attemptsStore.makeAttempt() // 6 (too many, locked)

            expect(attemptsStore.isLocked).toBeTruthy()

            await attemptsStore.unlock()

            expect(attemptsStore.isLocked).toBeFalsy()
        })
    })
})
