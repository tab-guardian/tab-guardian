// @vitest-environment happy-dom

import { config } from '@common/config'
import { trans } from '@common/modules'
import { describe, it, expect, beforeEach, suite } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { fakeGroup, fakeLink } from '@common/modules/fake'
import { GroupNotFoundError } from '@common/errors'

describe('groupStore', () => {
    beforeEach(() => setActivePinia(createPinia()))

    suite('get()', () => {
        it('returns group with the right group ID', () => {
            const store = useGroupStore()

            const group = fakeGroup()
            store.groups.push(group)

            const result = store.get(group.id)

            expect(result).not.toBeNull()
            expect(group.id).equal(result!.id)
        })

        it('returns group with the right group name', () => {
            const store = useGroupStore()

            const group = fakeGroup()
            store.groups.push(group)

            const result = store.get(group.name)

            expect(result).not.toBeNull()
            expect(group.name).equal(result!.name)
        })

        it('returns null with non-existent group ID', () => {
            const store = useGroupStore()

            const group = fakeGroup()
            store.groups.push(group)

            const result = store.get(0)

            expect(result).toBeNull()
        })

        it('returns null with non-existent group name', () => {
            const store = useGroupStore()
            const group = fakeGroup()
            store.groups.push(group)

            const result = store.get('some')

            expect(result).toBeNull()
        })
    })

    suite('lock()', () => {
        it('encrypts public group and makes it private', async () => {
            const store = useGroupStore()
            const group = fakeGroup()

            expect(group.isPrivate).toBeFalsy()
            expect(group.isEncrypted).toBeFalsy()

            const encryption = await store.lock(group, 'amyadams')

            expect(encryption.failed).toBeFalsy()
            expect(encryption.group?.isPrivate).toBeTruthy()
            expect(encryption.group?.isEncrypted).toBeTruthy()
        })

        it('encrypts private group', async () => {
            const store = useGroupStore()
            const group = fakeGroup({ isPrivate: true })

            expect(group.isPrivate).toBeTruthy()

            const encryption = await store.lock(group, 'amyadams')

            expect(encryption.failed).toBeFalsy()
            expect(encryption.group?.isPrivate).toBeTruthy()
            expect(encryption.group?.isEncrypted).toBeTruthy()
        })

        it('encrypts link fields', async () => {
            const store = useGroupStore()
            const link = fakeLink()

            const group = fakeGroup({
                isPrivate: true,
                links: [link],
            })

            expect(group.links).toHaveLength(1)

            const encryption = await store.lock(group, 'amyadams')

            expect(encryption.failed).toBeFalsy()
            expect(encryption.group?.links).toHaveLength(1)

            const encryptedLink = encryption.group?.links[0]!

            expect(encryptedLink).not.toBeUndefined()
            expect(encryptedLink.url).not.equal(link.url)
            expect(encryptedLink.title).not.equal(link.title)
            expect(encryptedLink.favIconUrl).not.equal(link.favIconUrl)
        })

        it('denies encryption when password and confirm do not match', async () => {
            const store = useGroupStore()
            const group = fakeGroup()

            const encryption = await store.lock(group, 'amyadams', 'amyadam')

            expect(encryption.failed).toBeTruthy()
            expect(encryption.message).equal(trans('passwords_not_match'))
            expect(encryption.group).toBeNull()
        })

        it('denies encryption when password is empty', async () => {
            const store = useGroupStore()
            const group = fakeGroup()

            const encryption = await store.lock(group, '')

            expect(encryption.failed).toBeTruthy()
            expect(encryption.message).equal(trans('pass_empty'))
            expect(encryption.group).toBeNull()
        })

        it('denies encryption when password is too short', async () => {
            const store = useGroupStore()
            const group = fakeGroup()

            const encryption = await store.lock(group, 'amy')

            const msg = trans(
                'passwords_min_length',
                config.MIN_PASS_LENGTH.toString(),
            )

            expect(encryption.failed).toBeTruthy()
            expect(encryption.message).equal(trans(msg))
            expect(encryption.group).toBeNull()
        })
    })

    suite('update()', () => {
        it('updates fields of a group', async () => {
            const store = useGroupStore()
            const group = fakeGroup()

            await store.save(group)

            await store.update(group.id, {
                name: 'NAME',
                bindUrl: 'BINDURL',
            })

            const updatedGroup = store.get(group.id)

            expect(updatedGroup).not.toBeNull()
            expect(updatedGroup?.id).equals(group.id)
            expect(updatedGroup?.name).equals('NAME')
            expect(updatedGroup?.bindUrl).equals('BINDURL')
        })

        it('throws error when group not found', async () => {
            const store = useGroupStore()

            const expectErr = new GroupNotFoundError(0, 'update')

            await expect(store.update(0, { name: 'NAME' })).rejects.toThrow(
                expectErr,
            )
        })
    })

    suite('deleteGroup()', () => {
        it('deletes group', async () => {
            const store = useGroupStore()
            const group = fakeGroup()

            await store.deleteGroup(group.id)
            const result = store.get(group.id)

            expect(result).toBeNull()
        })
    })
})
