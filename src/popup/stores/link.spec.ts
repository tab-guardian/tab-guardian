// @vitest-environment happy-dom

import type { LinkBuffer } from '@common/types'
import { describe, it, expect, beforeEach, suite } from 'vitest'
import { useLinkStore } from '@/stores/link'
import { useGroupStore } from '@/stores/group'
import { createPinia, setActivePinia } from 'pinia'
import { fakeGroup, fakeLink } from '@common/modules/fake'

describe('linkStore', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    it('isEmptyBuffer is empty by default', () => {
        const store = useLinkStore()
        expect(store.isEmptyBuffer).toBeTruthy()
    })

    suite('copyLink()', () => {
        it('sets buffer when you copy link for existing group', async () => {
            const store = useLinkStore()
            const groupStore = useGroupStore()

            const group = fakeGroup()

            const buf: LinkBuffer = {
                action: 'copy',
                initialGroupId: group.id,
                link: fakeLink(),
            }

            await groupStore.save(group)

            await store.copyLink(buf)

            expect(store.isEmptyBuffer).toBeFalsy()
        })

        it('throws Error when group does not exist', async () => {
            const store = useLinkStore()

            const buf: LinkBuffer = {
                action: 'copy',
                initialGroupId: 0,
                link: fakeLink(),
            }

            expect(store.copyLink(buf)).rejects.toThrowError()
            expect(store.isEmptyBuffer).toBeTruthy()
        })
    })
})
