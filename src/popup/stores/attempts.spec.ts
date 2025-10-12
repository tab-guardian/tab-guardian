// @vitest-environment happy-dom

import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAttemptsStore } from '@/stores/attempts'

describe('attempts store', () => {
    beforeEach(() => setActivePinia(createPinia()))

    it('can do 1 attempt', async () => {
        const attempt = await useAttemptsStore().makeAttempt() // 1
        expect(attempt.success).toBe(true)
    })

    it('can do 5 attempts', async () => {
        const store = useAttemptsStore()

        await store.makeAttempt() // 1
        await store.makeAttempt() // 2
        await store.makeAttempt() // 3
        await store.makeAttempt() // 4
        const attempt = await store.makeAttempt() // 5

        expect(attempt.success).toBe(true)
    })

    it('cannot do 6 attempts', async () => {
        const store = useAttemptsStore()

        await store.makeAttempt() // 1
        await store.makeAttempt() // 2
        await store.makeAttempt() // 3
        await store.makeAttempt() // 4
        await store.makeAttempt() // 5
        const attempt = await store.makeAttempt() // 6 (too many)

        expect(attempt.success).toBe(false)
    })

    it('is not locked after 1 attempt', async () => {
        const store = useAttemptsStore()
        await store.makeAttempt() // 1
        expect(store.isLocked).toBe(false)
    })

    it('is not locked after 4 attempts', async () => {
        const store = useAttemptsStore()

        await store.makeAttempt() // 1
        await store.makeAttempt() // 2
        await store.makeAttempt() // 3
        await store.makeAttempt() // 4

        expect(store.isLocked).toBe(false)
    })

    it('is locked after 5 attempts but attempt is success', async () => {
        const store = useAttemptsStore()

        await store.makeAttempt() // 1
        await store.makeAttempt() // 2
        await store.makeAttempt() // 3
        await store.makeAttempt() // 4
        const attempt = await store.makeAttempt() // 5

        expect(attempt.success).toBe(true)
        expect(store.isLocked).toBe(true)
    })

    it('removes lock with unlock() function', async () => {
        const store = useAttemptsStore()

        // Lock by making too many attempts
        await store.makeAttempt() // 1
        await store.makeAttempt() // 2
        await store.makeAttempt() // 3
        await store.makeAttempt() // 4
        await store.makeAttempt() // 5
        await store.makeAttempt() // 6 (too many, locked)

        expect(store.isLocked).toBe(true)

        await store.unlock()

        expect(store.isLocked).toBe(false)
    })
})
