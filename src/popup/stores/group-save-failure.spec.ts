// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { useSettingsStore } from '@/stores/settings'
import { groupStorage } from '@common/modules/storage/group'
import { fakeGroup, fakeLink } from '@common/modules/fake'
import { formatNumber, trans } from '@common/modules'
import { runtime } from '@common/modules/runtime'

describe('group store when saving fails', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('keeps the existing group when a replacement cannot be saved', async () => {
        const groupStore = useGroupStore()
        const oldUrl = 'https://old.example/page'

        await groupStore.create(
            fakeGroup({ id: 1, name: 'work', links: [fakeLink({ url: oldUrl })] }),
        )

        useSettingsStore().settings.overrideWithSameName = true

        failAllWrites(new Error('QUOTA_BYTES quota exceeded'))

        await expect(
            groupStore.create(fakeGroup({ id: 2, name: 'work' })),
        ).rejects.toThrow()

        const groups = await groupStorage.getAll()

        expect(groups).toHaveLength(1)
        expect(groups[0]!.links[0]!.url).toEqual(oldUrl)
    })

    it('reports that storage is full when locking a group cannot be saved', async () => {
        const groupStore = useGroupStore()
        const group = fakeGroup({ id: 3, name: 'work' })

        await groupStore.create(group)

        failAllWrites(new Error('QUOTA_BYTES quota exceeded'))

        const locking = await groupStore.lock(groupStore.get(3)!, 'strong-password')

        expect(locking.failed).toBeTruthy()
        expect(locking.message).toEqual(await storageFullMessage())
    })

    it('keeps the stored group unlocked when locking it cannot be saved', async () => {
        const groupStore = useGroupStore()
        const group = fakeGroup({ id: 4, name: 'work' })

        await groupStore.create(group)

        failAllWrites(new Error('QUOTA_BYTES quota exceeded'))

        await groupStore.lock(groupStore.get(4)!, 'strong-password')

        const [stored] = await groupStorage.getAll()

        expect(stored.isEncrypted).toBeFalsy()
    })

    it('reports a general save failure when locking fails for another reason', async () => {
        const groupStore = useGroupStore()
        const group = fakeGroup({ id: 5, name: 'work' })

        await groupStore.create(group)

        failAllWrites(new Error('unexpected storage failure'))

        const locking = await groupStore.lock(groupStore.get(5)!, 'strong-password')

        expect(locking.failed).toBeTruthy()
        expect(locking.message).toEqual(trans('save_failed'))
    })

    it('keeps the stored group when an update cannot be saved', async () => {
        const groupStore = useGroupStore()
        const groupUrl = 'https://work.example/page'

        await groupStore.create(
            fakeGroup({ id: 6, name: 'work', links: [fakeLink({ url: groupUrl })] }),
        )

        failAllWrites(new Error('QUOTA_BYTES quota exceeded'))

        await expect(
            groupStore.updateFields(6, {
                links: [fakeLink({ url: 'https://changed.example/page' })],
            }),
        ).rejects.toThrow()

        const [stored] = await groupStorage.getAll()

        expect(stored.links[0]!.url).toEqual(groupUrl)
    })
})

async function storageFullMessage(): Promise<string> {
    const MB = 1024 * 1024

    return trans(
        'not_enough_storage',
        formatNumber(runtime.storage.MAX_BYTES_QUOTA / MB),
        formatNumber((await runtime.storage.getBytesInUse()) / MB),
    )
}

function failAllWrites(error: Error): void {
    const realStorage = localStorage

    vi.stubGlobal('localStorage', {
        get length() {
            return realStorage.length
        },
        key: (index: number) => realStorage.key(index),
        getItem: (key: string) => realStorage.getItem(key),
        removeItem: (key: string) => realStorage.removeItem(key),
        clear: () => realStorage.clear(),
        setItem: () => {
            throw error
        },
    })
}
