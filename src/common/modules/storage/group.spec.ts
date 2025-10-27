// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { fakeGroup, fakeLink } from '@common/modules/fake'
import { createPinia, setActivePinia } from 'pinia'
import { groupStorage } from '@common/modules/storage/group'

describe('group storage module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('save()', () => {
        it('saves group into storage', async () => {
            const group = fakeGroup({ links: [fakeLink()] })
            await groupStorage.save(group)

            const itemStr = localStorage.getItem(group.id.toString())

            expect(itemStr).not.toBeNull()

            const itemParsed = JSON.parse(itemStr!)

            expect(itemParsed.id).equal(group.id)
            expect(itemParsed.name).equal(group.name)
            expect(itemParsed.links).toHaveLength(1)
        })

        it('adds group ID to groupIds storage', async () => {
            const group = fakeGroup()
            await groupStorage.save(group)

            const idsStr = localStorage.getItem('groupIds')

            expect(idsStr).not.toBeNull()

            const idsParsed = JSON.parse(idsStr!)

            expect(idsParsed).toBeTypeOf('object')
            expect(idsParsed).toHaveLength(1)
            expect(idsParsed[0]).equal(group.id)
        })
    })

    suite('delete()', () => {
        it('deletes group from storage', async () => {
            const group = fakeGroup()
            await groupStorage.save(group)

            await groupStorage.delete(group.id)

            const foundItem = localStorage.getItem(group.id.toString())

            expect(foundItem).toBeNull()
        })

        it('deletes group ID from groupIds', async () => {
            const group = fakeGroup()
            await groupStorage.save(group)

            await groupStorage.delete(group.id)

            const idsStr = localStorage.getItem('groupIds')
            const idsParsed = JSON.parse(idsStr!)

            expect(idsParsed).toBeTypeOf('object')
            expect(idsParsed).toHaveLength(0)
        })
    })

    suite('deleteAll()', () => {
        it('deletes all groups from storage', async () => {
            const group = fakeGroup()
            await groupStorage.save(group)

            await groupStorage.deleteAll()

            const foundItem = localStorage.getItem(group.id.toString())

            expect(foundItem).toBeNull()
        })

        it('deletes all group ids from groupIds', async () => {
            const group = fakeGroup()
            await groupStorage.save(group)

            await groupStorage.deleteAll()

            const idsStr = localStorage.getItem('groupIds')
            const idsParsed = JSON.parse(idsStr!)

            expect(idsParsed).toBeTypeOf('object')
            expect(idsParsed).toHaveLength(0)
        })
    })

    suite('getAll()', () => {
        it('loads all groups from storage', async () => {
            const group1 = fakeGroup()
            const group2 = fakeGroup()

            await groupStorage.save(group1)
            await groupStorage.save(group2)

            const groups = await groupStorage.getAll()

            expect(groups).toHaveLength(2)
            expect(groups[0].id).equal(group1.id)
            expect(groups[1].id).equal(group2.id)
        })

        it('returns empty array when there are not groups', async () => {
            const groups = await groupStorage.getAll()
            expect(groups).toHaveLength(0)
        })
    })
})
