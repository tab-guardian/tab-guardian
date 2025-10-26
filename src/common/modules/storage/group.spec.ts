// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
    deleteGroupFromStorage,
    saveGroupToStorage,
} from '@common/modules/storage/group'
import { fakeGroup, fakeLink } from '@common/modules/fake'

describe('group storage module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('saveGroupToStorage()', () => {
        it('saves group into storage', async () => {
            const group = fakeGroup({ links: [fakeLink()] })
            await saveGroupToStorage(group)

            const itemStr = localStorage.getItem(group.id.toString())

            expect(itemStr).not.toBeNull()

            const itemParsed = JSON.parse(itemStr!)

            expect(itemParsed.id).equal(group.id)
            expect(itemParsed.name).equal(group.name)
            expect(itemParsed.links).toHaveLength(1)
        })

        it('adds group ID to groupIds storage', async () => {
            const group = fakeGroup()
            await saveGroupToStorage(group)

            const idsStr = localStorage.getItem('groupIds')

            expect(idsStr).not.toBeNull()

            const idsParsed = JSON.parse(idsStr!)

            expect(idsParsed).toBeTypeOf('object')
            expect(idsParsed).toHaveLength(1)
            expect(idsParsed[0]).equal(group.id)
        })
    })

    suite('deleteGroupFromStorage()', () => {
        it('deletes group from storage', async () => {
            const group = fakeGroup()
            await saveGroupToStorage(group)

            await deleteGroupFromStorage(group.id)

            const foundItem = localStorage.getItem(group.id.toString())

            expect(foundItem).toBeNull()
        })

        it('deletes group ID from groupIds', async () => {
            const group = fakeGroup()
            await saveGroupToStorage(group)

            await deleteGroupFromStorage(group.id)

            const idsStr = localStorage.getItem('groupIds')
            const idsParsed = JSON.parse(idsStr!)

            expect(idsParsed).toBeTypeOf('object')
            expect(idsParsed).toHaveLength(0)
        })
    })
})
