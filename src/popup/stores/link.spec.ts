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

    suite('isLinkCut()', () => {
        it('returns true when link is cut', async () => {
            const store = useLinkStore()
            const groupStore = useGroupStore()

            const link = fakeLink()
            const group = fakeGroup({ links: [link] })

            await groupStore.save(group)

            const buf: LinkBuffer = {
                action: 'cut',
                initialGroupId: group.id,
                link,
            }

            await store.copyLink(buf)

            expect(store.isEmptyBuffer).toBeFalsy()
            expect(store.isLinkCut(link.id)).toBeTruthy()
        })

        it('returns false when link is copied', async () => {
            const store = useLinkStore()
            const groupStore = useGroupStore()

            const link = fakeLink()
            const group = fakeGroup({ links: [link] })

            await groupStore.save(group)

            const buf: LinkBuffer = {
                action: 'copy',
                initialGroupId: group.id,
                link,
            }

            await store.copyLink(buf)

            expect(store.isEmptyBuffer).toBeFalsy()
            expect(store.isLinkCut(link.id)).toBeFalsy()
        })

        it('returns false when buffer is empty', async () => {
            const store = useLinkStore()
            const groupStore = useGroupStore()

            const link = fakeLink()
            const group = fakeGroup({ links: [link] })

            await groupStore.save(group)

            expect(store.isEmptyBuffer).toBeTruthy()
            expect(store.isLinkCut(link.id)).toBeFalsy()
        })

        it('returns false when link ID does not match', async () => {
            const store = useLinkStore()
            const groupStore = useGroupStore()

            const link = fakeLink()
            const group = fakeGroup({ links: [link] })

            await groupStore.save(group)

            await store.copyLink({
                action: 'copy',
                initialGroupId: group.id,
                link,
            })

            const newLink = fakeLink()

            expect(store.isEmptyBuffer).toBeFalsy()
            expect(store.isLinkCut(newLink.id)).toBeFalsy()
        })
    })

    suite('pasteLink()', () => {
        it('copies link to provided group', async () => {
            const store = useLinkStore()
            const groupStore = useGroupStore()

            const link = fakeLink()

            const initialGroup = fakeGroup({ links: [link] })
            const destinationGroup = fakeGroup({ links: [] })

            await groupStore.saveMany([initialGroup, destinationGroup])

            await store.copyLink({
                action: 'copy',
                initialGroupId: initialGroup.id,
                link,
            })

            await store.pasteLink(destinationGroup.id)
        })
    })
})
