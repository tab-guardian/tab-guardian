// @vitest-environment happy-dom

import type { LinkBuffer } from '@common/types'
import { describe, it, expect, beforeEach, suite } from 'vitest'
import { useLinkStore } from '@/stores/link'
import { useGroupStore } from '@/stores/group'
import { createPinia, setActivePinia } from 'pinia'
import { fakeGroup, fakeLink } from '@common/modules/fake'

describe('link store', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('isEmptyBuffer', () => {
        it('is empty by default', () => {
            const linkStore = useLinkStore()
            expect(linkStore.isEmptyBuffer).toBeTruthy()
        })
    })

    suite('copyLink()', () => {
        it('sets buffer when you copy link for existing group', async () => {
            const linkStore = useLinkStore()
            const groupStore = useGroupStore()

            const group = fakeGroup()

            const buf: LinkBuffer = {
                action: 'copy',
                initialGroupId: group.id,
                link: fakeLink(),
            }

            await groupStore.save(group)

            await linkStore.copyLink(buf)

            expect(linkStore.isEmptyBuffer).toBeFalsy()
        })

        it('throws Error when group does not exist', async () => {
            const linkStore = useLinkStore()

            const buf: LinkBuffer = {
                action: 'copy',
                initialGroupId: 0,
                link: fakeLink(),
            }

            await expect(linkStore.copyLink(buf)).rejects.toThrowError()

            expect(linkStore.isEmptyBuffer).toBeTruthy()
        })
    })

    suite('isLinkCut()', () => {
        it('returns true when link is cut', async () => {
            const linkStore = useLinkStore()
            const groupStore = useGroupStore()

            const link = fakeLink()
            const group = fakeGroup({ links: [link] })

            await groupStore.save(group)

            const buf: LinkBuffer = {
                action: 'cut',
                initialGroupId: group.id,
                link,
            }

            await linkStore.copyLink(buf)

            expect(linkStore.isEmptyBuffer).toBeFalsy()
            expect(linkStore.isLinkCut(link.id)).toBeTruthy()
        })

        it('returns false when link is copied', async () => {
            const linkStore = useLinkStore()
            const groupStore = useGroupStore()

            const link = fakeLink()
            const group = fakeGroup({ links: [link] })

            await groupStore.save(group)

            const buf: LinkBuffer = {
                action: 'copy',
                initialGroupId: group.id,
                link,
            }

            await linkStore.copyLink(buf)

            expect(linkStore.isEmptyBuffer).toBeFalsy()
            expect(linkStore.isLinkCut(link.id)).toBeFalsy()
        })

        it('returns false when buffer is empty', async () => {
            const linkStore = useLinkStore()
            const groupStore = useGroupStore()

            const link = fakeLink()
            const group = fakeGroup({ links: [link] })

            await groupStore.save(group)

            expect(linkStore.isEmptyBuffer).toBeTruthy()
            expect(linkStore.isLinkCut(link.id)).toBeFalsy()
        })

        it('returns false when link ID does not match', async () => {
            const linkStore = useLinkStore()
            const groupStore = useGroupStore()

            const link = fakeLink()
            const group = fakeGroup({ links: [link] })

            await groupStore.save(group)

            await linkStore.copyLink({
                action: 'copy',
                initialGroupId: group.id,
                link,
            })

            const newLink = fakeLink()

            expect(linkStore.isEmptyBuffer).toBeFalsy()
            expect(linkStore.isLinkCut(newLink.id)).toBeFalsy()
        })
    })

    suite('pasteLink()', () => {
        it('copies link to provided group', async () => {
            const linkStore = useLinkStore()
            const groupStore = useGroupStore()

            const link = fakeLink()

            const initialGroup = fakeGroup({ links: [link] })
            const destinationGroup = fakeGroup({ links: [] })

            await groupStore.saveMany([initialGroup, destinationGroup])

            await linkStore.copyLink({
                action: 'copy',
                initialGroupId: initialGroup.id,
                link,
            })

            await linkStore.pasteLink(destinationGroup.id)

            const destGroup = groupStore.get(destinationGroup.id)
            expect(destGroup?.links).toHaveLength(1)
            expect(destGroup?.links[0].id).not.equal(link.id)

            const initGroup = groupStore.get(initialGroup.id)
            expect(initGroup?.links).toHaveLength(1)
            expect(initGroup?.links[0].id).equal(link.id)

            expect(linkStore.isEmptyBuffer).toBeTruthy()
        })

        it('cuts link from initial to provided group', async () => {
            const linkStore = useLinkStore()
            const groupStore = useGroupStore()

            const link = fakeLink()

            const initialGroup = fakeGroup({ links: [link] })
            const destinationGroup = fakeGroup({ links: [] })

            await groupStore.saveMany([initialGroup, destinationGroup])

            await linkStore.copyLink({
                action: 'cut',
                initialGroupId: initialGroup.id,
                link,
            })

            await linkStore.pasteLink(destinationGroup.id)

            const initGroup = groupStore.get(initialGroup.id)
            expect(initGroup?.links).toHaveLength(0)

            const destGroup = groupStore.get(destinationGroup.id)
            expect(destGroup?.links).toHaveLength(1)
            expect(destGroup?.links[0].id).equal(link.id)

            expect(linkStore.isEmptyBuffer).toBeTruthy()
        })
    })
})
