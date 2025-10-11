// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, suite } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAttemptsStore } from '@/stores/attempts'

describe('attempts store', () => {
    beforeEach(() => setActivePinia(createPinia()))

    suite('test attempts', () => {
        it('can do 1 attempt', async () => {
            const attempt = await useAttemptsStore().makeAttempt() // 1
            expect(attempt.success).toBeTruthy()
        })

        it('can do 5 attempts', async () => {
            const store = useAttemptsStore()

            await store.makeAttempt() // 1
            await store.makeAttempt() // 2
            await store.makeAttempt() // 3
            await store.makeAttempt() // 4
            const attempt = await store.makeAttempt() // 5

            expect(attempt.success).toBeTruthy()
        })

        it('cannot do 6 attempts', async () => {
            const store = useAttemptsStore()

            await store.makeAttempt() // 1
            await store.makeAttempt() // 2
            await store.makeAttempt() // 3
            await store.makeAttempt() // 4
            await store.makeAttempt() // 5
            const attempt = await store.makeAttempt() // 6 (too many)

            expect(attempt.success).toBeFalsy()
        })
    })

    suite('test lock', () => {
        it('is not locked after 1 attempt', async () => {
            const store = useAttemptsStore()
            await store.makeAttempt() // 1
            expect(store.isLocked).toBeFalsy()
        })

        it('is not locked after 4 attempts', async () => {
            const store = useAttemptsStore()

            await store.makeAttempt() // 1
            await store.makeAttempt() // 2
            await store.makeAttempt() // 3
            await store.makeAttempt() // 4

            expect(store.isLocked).toBeFalsy()
        })

        it('is locked after 5 attempts', async () => {
            const store = useAttemptsStore()

            await store.makeAttempt() // 1
            await store.makeAttempt() // 2
            await store.makeAttempt() // 3
            await store.makeAttempt() // 4
            await store.makeAttempt() // 5

            expect(store.isLocked).toBeFalsy()
        })
    })
})
