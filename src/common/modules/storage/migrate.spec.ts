// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { runtime } from '@common/modules/runtime'
import { fakeGroup } from '@common/modules/fake'
import { KEY_PREFIX as PASSWORD_KEY_PREFIX } from '@common/modules/storage/password'
import {
    KEY_PREFIX as SCHEMA_KEY,
    migrateStorage,
} from '@common/modules/storage/migrate'

describe('storage migration', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    suite('migrateStorage()', () => {
        it('removes legacy passwords and records schema version', async () => {
            await runtime.storage.set(PASSWORD_KEY_PREFIX + '1', 'old-pass')
            await runtime.storage.set('1', fakeGroup({ id: 1 }))

            await migrateStorage()

            const items = await runtime.storage.all()
            const leftovers = Object.keys(items).filter(key =>
                key.startsWith(PASSWORD_KEY_PREFIX),
            )

            expect(leftovers).toHaveLength(0)
            expect(items['1']).toBeDefined()

            const [schema] = await runtime.storage.get<number>(SCHEMA_KEY)
            expect(schema).toEqual(1)
        })

        it('skips migration when schema is current', async () => {
            await runtime.storage.set(PASSWORD_KEY_PREFIX + '1', 'old-pass')

            const allSpy = vi.spyOn(runtime.storage, 'all')

            await migrateStorage()
            await migrateStorage()

            expect(allSpy).toHaveBeenCalledTimes(1)
        })

        it('keeps data when schema is already recorded', async () => {
            await runtime.storage.set(SCHEMA_KEY, 1)
            await runtime.storage.set(PASSWORD_KEY_PREFIX + '1', 'old-pass')

            await migrateStorage()

            const items = await runtime.storage.all()
            const leftovers = Object.keys(items).filter(key =>
                key.startsWith(PASSWORD_KEY_PREFIX),
            )

            expect(leftovers).toHaveLength(1)
        })
    })
})
