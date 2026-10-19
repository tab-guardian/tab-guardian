import type { Pinia } from 'pinia'
import type { Group } from '@common/types'
import { expect, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { fakeGroup, fakeLink } from '@common/modules/fake'

export function useFreshPinia(): Pinia {
    const pinia = createPinia()
    setActivePinia(pinia)

    return pinia
}

export async function waitUntil(assertion: () => void): Promise<void> {
    await vi.waitFor(assertion, { timeout: 5000, interval: 25 })
}

// Stored group only includes groups that are visible in the top level.
// Groups that are in folders or hidden are not gonna be returned here.
export function storedGroup(name: string): Group {
    const group = useGroupStore().rootGroups.find(g => g.name === name)
    expect(group).toBeDefined()
    return group!
}

// Initial groups are all groups loaded from the storage without any exceptions
export function storedInitialGroup(name: string): Group {
    const group = useGroupStore().allGroups.find(g => g.name === name)
    expect(group).toBeDefined()
    return group!
}

export async function createLockedGroup(
    fields: Partial<Group> = {},
    password = 'strong-password',
): Promise<Group> {
    const groupStore = useGroupStore()
    const locking = await groupStore.lock(fakeGroup(fields), password)

    expect(locking.failed).toBeFalsy()

    await groupStore.create(locking.group!)

    return groupStore.get(locking.group!.id)!
}

export async function createUnlockedPrivateGroup(
    fields: Partial<Group> = {},
    password = 'strong-password',
): Promise<Group> {
    const groupStore = useGroupStore()
    const group = await createLockedGroup(fields, password)
    const unlocking = await groupStore.unlock(group, password)

    expect(unlocking.failed).toBeFalsy()

    return groupStore.get(group.id)!
}

export const LEGACY_WRONG_PASSWORD = 'wrong-68'

export function createLegacyCryptoJsGroup(fields: Partial<Group> = {}): Group {
    const group = fakeGroup(fields)

    return {
        ...group,
        isPrivate: true,
        isEncrypted: true,
        links: [
            {
                ...fakeLink(),
                url: 'U2FsdGVkX18VS6dNsQdVnLCs/1+pOstk9AKduehyUEVCJIh5eZRTlm/eWtVL2m18',
                title: 'U2FsdGVkX18ZWUQGDTma8Jlj3x42VBe3cw+Zedfpt1U=',
                favIconUrl:
                    'U2FsdGVkX1+qCL9WhjRNUJvb87tI3inIKJrs0wuSTDN32+aODTSZxG1B0PEZqvjU',
            },
        ],
    }
}

// Makes generateId() return the given ids in order and only then
// fallback to real randomness. Handy to force an id collision in tests.
export function stubGenerateId(ids: number[]): void {
    const spy = vi.spyOn(crypto, 'getRandomValues')

    for (const id of ids) {
        spy.mockImplementationOnce((buffer: ArrayBufferView) => {
            const values = buffer as Uint32Array

            // Same 21/32 bits split that generateId() packs back together
            values[0] = Math.floor(id / 0x100000000) % 0x200000
            values[1] = id % 0x100000000

            return buffer
        })
    }
}
