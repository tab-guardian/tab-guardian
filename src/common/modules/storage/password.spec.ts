// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { runtime } from '@common/modules/runtime'
import {
    KEY_PREFIX,
    cleanupLegacyPasswords,
    passwordStorage,
} from '@common/modules/storage/password'

describe('password storage module', () => {
    beforeEach(() => {
        localStorage.clear()
        sessionStorage.clear()
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    suite('save()', () => {
        it('saves and returns password', async () => {
            await passwordStorage.save(1, 'anna-korot')
            expect(await passwordStorage.get(1)).toEqual('anna-korot')
        })

        it('never writes to persistent storage', async () => {
            await passwordStorage.save(1, 'anna-korot')
            expect(localStorage.getItem(KEY_PREFIX + '1')).toBeNull()
        })

        it('ignores empty password', async () => {
            await passwordStorage.save(3, '')
            expect(await passwordStorage.get(3)).toBeNull()
        })
    })

    suite('delete()', () => {
        it('removes saved password', async () => {
            await passwordStorage.save(1, 'anna-korot')
            await passwordStorage.delete(1)

            expect(await passwordStorage.get(1)).toBeNull()
        })
    })

    suite('cleanupLegacyPasswords()', () => {
        it('removes legacy passwords from persistent storage and keeps the rest', async () => {
            await runtime.storage.set(KEY_PREFIX + '1', 'old-pass')
            await runtime.storage.set(KEY_PREFIX + '2', 'old-pass')
            await runtime.storage.set('groups', { ids: [1] })

            await cleanupLegacyPasswords()

            const items = await runtime.storage.all()
            const leftovers = Object.keys(items).filter(key =>
                key.startsWith(KEY_PREFIX),
            )

            expect(leftovers).toHaveLength(0)
            expect(items['groups']).toBeDefined()
        })

        it('is a no-op when nothing is left to clean', async () => {
            await runtime.storage.set(KEY_PREFIX + '1', 'old-pass')

            const allSpy = vi.spyOn(runtime.storage, 'all')

            await cleanupLegacyPasswords()
            await cleanupLegacyPasswords()

            expect(allSpy).toHaveBeenCalledTimes(1)

            const items = await runtime.storage.all()
            const leftovers = Object.keys(items).filter(key =>
                key.startsWith(KEY_PREFIX),
            )

            expect(leftovers).toHaveLength(0)
        })
    })
})
