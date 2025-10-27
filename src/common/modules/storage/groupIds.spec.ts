// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
    deleteGroupIdFromStorage,
    getGroupIdsFromStorage,
    saveGroupIdsToStorage,
} from '@common/modules/storage/groupIds'

describe('groupIds storage module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('saveGroupIdsToStorage()', () => {
        it('saves group id to storage', async () => {
            await saveGroupIdsToStorage([1, 3, 5])
            const itemStr = localStorage.getItem('groupIds')
            expect(itemStr).equal('[1,3,5]')
        })

        it('removes group IDs with empty array', async () => {
            await saveGroupIdsToStorage([])
            const itemStr = localStorage.getItem('groupIds')
            expect(itemStr).equal('[]')
        })
    })

    suite('getGroupIdsFromStorage()', () => {
        it('fetches group IDs from storage', async () => {
            await saveGroupIdsToStorage([1, 2, 3])
            const ids = await getGroupIdsFromStorage()

            expect(ids).toHaveLength(3)
            expect(ids[0]).equal(1)
            expect(ids[1]).equal(2)
            expect(ids[2]).equal(3)
        })

        it('returns empty array when no group IDs', async () => {
            await saveGroupIdsToStorage([])
            const ids = await getGroupIdsFromStorage()
            expect(ids).toHaveLength(0)
        })

        it('returns empty array for non-existent groupIds', async () => {
            const ids = await getGroupIdsFromStorage()
            expect(ids).toHaveLength(0)
        })
    })

    suite('deleteGroupIdFromStorage()', () => {
        it('deletes provided group ID', async () => {
            await saveGroupIdsToStorage([1, 10, 100])
            await deleteGroupIdFromStorage(10)

            const itemStr = localStorage.getItem('groupIds')

            expect(itemStr).equal('[1,100]')
        })

        it('ignores deleting non-existent group IDs', async () => {
            await saveGroupIdsToStorage([1, 10, 100])
            await deleteGroupIdFromStorage(0)

            const itemStr = localStorage.getItem('groupIds')

            expect(itemStr).equal('[1,10,100]')
        })
    })
})
