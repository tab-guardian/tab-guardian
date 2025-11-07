// @vitest-environment happy-dom

import { config } from '@common/config'
import { trans } from '@common/modules'
import { describe, it, expect, beforeEach, suite } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { fakeGroup, fakeLink } from '@common/modules/fake'

describe('group store', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('save()', () => {
        it('saves group to groups state', async () => {
            const groupStore = useGroupStore()
            const group = fakeGroup()

            expect(groupStore.groups).toHaveLength(0)

            await groupStore.save(group)

            expect(groupStore.groups).toHaveLength(1)
        })

        it('saves group to local storage', async () => {
            const groupStore = useGroupStore()
            const group = fakeGroup()

            await groupStore.save(group)

            const result = localStorage.getItem(group.id.toString())

            expect(result).not.toBeNull()

            const obj = JSON.parse(result!)

            expect(obj.id).equal(group.id)
        })

        it('updates updatedAt timestamp', async () => {
            const updatedAt = 444444
            const currTimestamp = Date.now()

            const groupStore = useGroupStore()
            const group = fakeGroup({ updatedAt })

            expect(group.updatedAt).equal(updatedAt)

            await groupStore.save(group)

            expect(groupStore.groups).toHaveLength(1)
            expect(groupStore.groups[0]?.updatedAt).toBeGreaterThanOrEqual(
                currTimestamp,
            )
        })

        it('does not update updatedAt timestamp when asked', async () => {
            const updatedAt = 444444

            const groupStore = useGroupStore()
            const group = fakeGroup({ updatedAt })

            expect(group.updatedAt).equal(updatedAt)

            await groupStore.save(group, false)

            expect(groupStore.groups).toHaveLength(1)
            expect(groupStore.groups[0]?.updatedAt).equal(updatedAt)
        })
    })

    suite('get()', () => {
        it('returns group with the right group ID', () => {
            const groupStore = useGroupStore()

            const group = fakeGroup()
            groupStore.groups.push(group)

            const result = groupStore.get(group.id)

            expect(result).not.toBeNull()
            expect(group.id).equal(result!.id)
        })

        it('returns group with the right group name', () => {
            const groupStore = useGroupStore()

            const group = fakeGroup()
            groupStore.groups.push(group)

            const result = groupStore.get(group.name)

            expect(result).not.toBeNull()
            expect(group.name).equal(result!.name)
        })

        it('returns null with non-existent group ID', () => {
            const groupStore = useGroupStore()

            const group = fakeGroup()
            groupStore.groups.push(group)

            const result = groupStore.get(0)

            expect(result).toBeNull()
        })

        it('returns null with non-existent group name', () => {
            const groupStore = useGroupStore()
            const group = fakeGroup()
            groupStore.groups.push(group)

            const result = groupStore.get('some')

            expect(result).toBeNull()
        })
    })

    suite('lock()', () => {
        it('encrypts public group and makes it private', async () => {
            const groupStore = useGroupStore()
            const group = fakeGroup()

            expect(group.isPrivate).toBeFalsy()
            expect(group.isEncrypted).toBeFalsy()

            const encryption = await groupStore.lock(group, 'amyadams')

            expect(encryption.failed).toBeFalsy()
            expect(encryption.group?.isPrivate).toBeTruthy()
            expect(encryption.group?.isEncrypted).toBeTruthy()
        })

        it('encrypts private group', async () => {
            const groupStore = useGroupStore()
            const group = fakeGroup({ isPrivate: true })

            expect(group.isPrivate).toBeTruthy()

            const encryption = await groupStore.lock(group, 'amyadams')

            expect(encryption.failed).toBeFalsy()
            expect(encryption.group?.isPrivate).toBeTruthy()
            expect(encryption.group?.isEncrypted).toBeTruthy()
        })

        it('encrypts link fields', async () => {
            const groupStore = useGroupStore()
            const link = fakeLink()

            const group = fakeGroup({
                isPrivate: true,
                links: [link],
            })

            expect(group.links).toHaveLength(1)

            const encryption = await groupStore.lock(group, 'amyadams')

            expect(encryption.failed).toBeFalsy()
            expect(encryption.group?.links).toHaveLength(1)

            const encryptedLink = encryption.group?.links[0]!

            expect(encryptedLink).not.toBeUndefined()
            expect(encryptedLink.url).not.equal(link.url)
            expect(encryptedLink.title).not.equal(link.title)
            expect(encryptedLink.favIconUrl).not.equal(link.favIconUrl)
        })

        it('denies encryption when password and confirm do not match', async () => {
            const groupStore = useGroupStore()
            const group = fakeGroup()

            const encryption = await groupStore.lock(group, 'amyadams', 'amyadam')

            expect(encryption.failed).toBeTruthy()
            expect(encryption.message).equal(trans('passwords_not_match'))
            expect(encryption.group).toBeNull()
        })

        it('denies encryption when password is empty', async () => {
            const groupStore = useGroupStore()
            const group = fakeGroup()

            const encryption = await groupStore.lock(group, '')

            expect(encryption.failed).toBeTruthy()
            expect(encryption.message).equal(trans('pass_empty'))
            expect(encryption.group).toBeNull()
        })

        it('denies encryption when password is too short', async () => {
            const groupStore = useGroupStore()
            const group = fakeGroup()

            const encryption = await groupStore.lock(group, 'amy')

            const msg = trans(
                'password_min_length',
                config.MIN_PASS_LENGTH.toString(),
            )

            expect(encryption.failed).toBeTruthy()
            expect(encryption.message).equal(trans(msg))
            expect(encryption.group).toBeNull()
        })
    })

    suite('saveMany()', () => {
        it('saves many groups', async () => {
            const groupStore = useGroupStore()

            const group1 = fakeGroup()
            const group2 = fakeGroup()

            await groupStore.saveMany([group1, group2])

            expect(groupStore.groups).toHaveLength(2)
        })

        it('saves many groups without replacing duplicates', async () => {
            const groupStore = useGroupStore()

            const group1 = fakeGroup({ id: 1 })
            const group2 = fakeGroup({ id: 2 })

            await groupStore.saveMany([group1, group2])
            await groupStore.saveMany([group1, group2])

            expect(groupStore.groups).toHaveLength(4)
        })

        it('saves many groups without replacing duplicates', async () => {
            const groupStore = useGroupStore()

            const group1 = fakeGroup()
            const group2 = fakeGroup()

            await groupStore.saveMany([group1, group2], true)
            await groupStore.saveMany([group1, group2], true)

            expect(groupStore.groups).toHaveLength(2)
        })

        it('does not update updatedAt field on groups', async () => {
            const groupStore = useGroupStore()
            const updatedAt = Date.now()

            const group1 = fakeGroup({ updatedAt })
            const group2 = fakeGroup({ updatedAt })

            await groupStore.saveMany([group1, group2])

            expect(groupStore.groups).toHaveLength(2)
            expect(groupStore.groups[0]!.updatedAt).equal(updatedAt)
            expect(groupStore.groups[1]!.updatedAt).equal(updatedAt)
        })
    })

    suite('update()', () => {
        it('updates fields of a group', async () => {
            const groupStore = useGroupStore()
            const group = fakeGroup()

            await groupStore.save(group)

            const result = await groupStore.update(group.id, {
                name: 'NAME',
                bindUrl: 'BINDURL',
            })

            expect(result).toBeTruthy()

            const updatedGroup = groupStore.get(group.id)

            expect(updatedGroup).not.toBeNull()
            expect(updatedGroup?.id).equals(group.id)
            expect(updatedGroup?.name).equals('NAME')
            expect(updatedGroup?.bindUrl).equals('BINDURL')
        })

        it('returns false when group not found', async () => {
            const groupStore = useGroupStore()
            const result = await groupStore.update(0, { name: 'NAME' })
            expect(result).toBeFalsy()
        })
    })

    suite('deleteGroup()', () => {
        it('deletes group', async () => {
            const groupStore = useGroupStore()
            const group = fakeGroup()

            await groupStore.save(group)

            await groupStore.deleteGroup(group.id)
            const result = groupStore.get(group.id)

            expect(result).toBeNull()
            expect(localStorage.getItem(group.id.toString())).toBeNull()
        })

        it('silently handles deleting non existent group', async () => {
            const groupStore = useGroupStore()
            const group = fakeGroup()

            await groupStore.save(group)
            await groupStore.deleteGroup(0)

            expect(groupStore.groups).toHaveLength(1)
        })
    })

    suite('deleteAll', () => {
        it('deletes all groups', async () => {
            const groupStore = useGroupStore()

            const group1 = fakeGroup()
            const group2 = fakeGroup()

            await groupStore.saveMany([group1, group2], false)

            expect(groupStore.groups).toHaveLength(2)

            await groupStore.deleteAll()

            expect(groupStore.groups).toHaveLength(0)
            expect(localStorage.getItem(group1.id.toString())).toBeNull()
            expect(localStorage.getItem(group2.id.toString())).toBeNull()
        })

        it('works fine if no groups exist', async () => {
            const groupStore = useGroupStore()
            await groupStore.deleteAll()
            expect(groupStore.groups).toHaveLength(0)
        })
    })

    suite('deleteLinkFrom()', () => {
        it('deletes a link from a group', async () => {
            const groupStore = useGroupStore()

            const link1 = fakeLink()
            const link2 = fakeLink()

            const group = fakeGroup({
                links: [link1, link2],
            })

            await groupStore.save(group)
            const deleted = await groupStore.deleteLinkFrom(group.id, link2.id)

            expect(deleted).toBeTruthy()

            const foundGroup = groupStore.groups[0]

            expect(foundGroup).toBeDefined()
            expect(foundGroup?.links).toHaveLength(1)
        })

        it('deletes only 1 link if has duplicates', async () => {
            const groupStore = useGroupStore()
            const link = fakeLink()

            const group = fakeGroup({
                links: [link, link, link],
            })

            await groupStore.save(group)
            const deleted = await groupStore.deleteLinkFrom(group.id, link.id)

            expect(deleted).toBeTruthy()

            const foundGroup = groupStore.groups[0]

            expect(foundGroup).toBeDefined()
            expect(foundGroup?.links).toHaveLength(2)
        })

        it('returns false for non-existent group', async () => {
            const groupStore = useGroupStore()

            const link1 = fakeLink()
            const link2 = fakeLink()

            const group = fakeGroup({
                links: [link1, link2],
            })

            await groupStore.save(group)
            const deleted = await groupStore.deleteLinkFrom(0, link2.id)

            expect(deleted).toBeFalsy()

            const foundGroup = groupStore.groups[0]

            expect(foundGroup).toBeDefined()
            expect(foundGroup?.links).toHaveLength(2)
        })

        it('returns false for non-existent link', async () => {
            const groupStore = useGroupStore()

            const link1 = fakeLink()
            const link2 = fakeLink()

            const group = fakeGroup({
                links: [link1, link2],
            })

            await groupStore.save(group)
            const deleted = await groupStore.deleteLinkFrom(group.id, 0)

            expect(deleted).toBeFalsy()

            const foundGroup = groupStore.groups[0]

            expect(foundGroup).toBeDefined()
            expect(foundGroup?.links).toHaveLength(2)
        })
    })

    suite('insertLinksInto()', () => {
        it('adds links to the given group', async () => {
            const groupStore = useGroupStore()

            const group = fakeGroup({
                links: [fakeLink()],
            })

            await groupStore.save(group)

            expect(group.links).toHaveLength(1)

            const newLink1 = fakeLink()
            const newLink2 = fakeLink()

            const inserted = await groupStore.insertLinksInto(group.id, [
                newLink1,
                newLink2,
            ])

            expect(inserted).toBeTruthy()

            const foundGroup = groupStore.groups[0]

            expect(groupStore.groups).toHaveLength(1)
            expect(foundGroup).toBeDefined()
            expect(foundGroup?.links).toHaveLength(3)
        })

        it('returns false for non-existent group', async () => {
            const groupStore = useGroupStore()

            const group = fakeGroup({
                links: [fakeLink()],
            })

            await groupStore.save(group)

            expect(group.links).toHaveLength(1)

            const newLink1 = fakeLink()
            const newLink2 = fakeLink()

            const inserted = await groupStore.insertLinksInto(0, [
                newLink1,
                newLink2,
            ])

            expect(inserted).toBeFalsy()

            const foundGroup = groupStore.groups[0]

            expect(groupStore.groups).toHaveLength(1)
            expect(foundGroup).toBeDefined()
            expect(foundGroup?.links).toHaveLength(1)
        })
    })

    suite('exist()', () => {
        it('returns true for existing group', async () => {
            const groupStore = useGroupStore()
            const group = fakeGroup()

            await groupStore.save(group)

            expect(groupStore.exist(group.id)).toBeTruthy()
        })

        it('returns false for non-existing group', async () => {
            expect(useGroupStore().exist(0)).toBeFalsy()
        })
    })

    suite('updateLink()', () => {
        it('updates fields of a link', async () => {
            const groupStore = useGroupStore()
            const link = fakeLink()
            const group = fakeGroup({ links: [link] })

            await groupStore.save(group)

            const result = await groupStore.updateLink(group.id, link.id, {
                title: 'Anna',
                isPinned: true,
                favIconUrl: 'nice',
            })

            expect(result).toBeTruthy()

            const updatedGroup = groupStore.get(group.id)

            expect(updatedGroup).not.toBeNull()

            const foundLink = updatedGroup?.links[0]!

            expect(foundLink.isPinned).toBeTruthy()
            expect(foundLink.title).equal('Anna')
            expect(foundLink.favIconUrl).equal('nice')
        })

        it('returns false when group not found', async () => {
            const groupStore = useGroupStore()
            const link = fakeLink()
            const result = await groupStore.updateLink(0, link.id, {
                isPinned: true,
            })

            expect(result).toBeFalsy()
        })

        it('returns false when link not found', async () => {
            const groupStore = useGroupStore()
            const link = fakeLink({ id: 1 })
            const group = fakeGroup({ links: [link] })

            await groupStore.save(group)

            const result = await groupStore.updateLink(group.id, 2, {
                isPinned: true,
            })

            expect(result).toBeFalsy()

            const updatedGroup = groupStore.get(group.id)
            const foundLink = updatedGroup?.links[0]!

            expect(foundLink.isPinned).toBeFalsy()
        })
    })
})
