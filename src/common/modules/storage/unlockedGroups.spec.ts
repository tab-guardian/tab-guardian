// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { KEY, unlockedGroupsStorage } from '@common/modules/storage/unlockedGroups'

describe('unlockedGroups storage module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('set()', () => {
        it('sets key to 1', async () => {
            await unlockedGroupsStorage.set()
            const itemStr = localStorage.getItem(KEY)
            expect(itemStr).equal('"1"')
        })

        it('sets item twice', async () => {
            await unlockedGroupsStorage.set()
            await unlockedGroupsStorage.set()
            const itemStr = localStorage.getItem(KEY)
            expect(itemStr).equal('"1"')
        })
    })

    suite('delete()', () => {
        it('deletes item from storage', async () => {
            await unlockedGroupsStorage.set()
            await unlockedGroupsStorage.delete()

            const itemStr = localStorage.getItem(KEY)
            expect(itemStr).toBeNull()
        })

        it('ignores deleting non-existent item', async () => {
            await unlockedGroupsStorage.delete()
            const itemStr = localStorage.getItem(KEY)
            expect(itemStr).toBeNull()
        })
    })

    suite('has()', () => {
        it('returns true for existing item', async () => {
            await unlockedGroupsStorage.set()
            const has = await unlockedGroupsStorage.has()
            expect(has).toBeTruthy()
        })

        it('returns false for non-existing item', async () => {
            const has = await unlockedGroupsStorage.has()
            expect(has).toBeFalsy()
        })
    })
})
