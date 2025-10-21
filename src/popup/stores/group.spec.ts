// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, suite } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { getFakeGroup } from '@common/modules/fake'

describe('groupStore', () => {
    beforeEach(() => setActivePinia(createPinia()))

    suite('getGroup()', () => {
        it('returns group with the right group ID', () => {
            const groupStore = useGroupStore()
            const group = getFakeGroup()
            groupStore.groups.push(group)

            const result = groupStore.getGroup(group.id)

            expect(result).not.toBeNull()
            expect(group.id).equal(result!.id)
        })

        it('returns group with the right group name', () => {
            const groupStore = useGroupStore()
            const group = getFakeGroup()
            groupStore.groups.push(group)

            const result = groupStore.getGroup(group.name)

            expect(result).not.toBeNull()
            expect(group.name).equal(result!.name)
        })

        it('returns null with non-existent group ID', () => {
            const groupStore = useGroupStore()
            const group = getFakeGroup()
            groupStore.groups.push(group)

            const result = groupStore.getGroup(0)

            expect(result).toBeNull()
        })

        it('returns null with non-existent group name', () => {
            const groupStore = useGroupStore()
            const group = getFakeGroup()
            groupStore.groups.push(group)

            const result = groupStore.getGroup('some')

            expect(result).toBeNull()
        })
    })
})
