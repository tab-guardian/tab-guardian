// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatNumber, trans } from '@common/modules'
import { config } from '@common/config'
import { runtime } from '@common/modules/runtime'
import { getChromeRuntimeAdapter } from '@common/modules/runtime/chromeRuntimeAdapter'
import { getFirefoxRuntimeAdapter } from '@common/modules/runtime/firefoxRuntimeAdapter'
import { groupStorage } from '@common/modules/storage/group'
import { groupIdsStorage } from '@common/modules/storage/groupIds'
import { fakeGroup } from '@common/modules/fake'

describe('saving to storage when the write fails', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('throws a save error', async () => {
        failAllWrites(new Error('disk is on fire'))

        await expect(runtime.storage.set('notes', 'hello')).rejects.toThrow(
            trans('save_failed'),
        )
    })

    it('reports storage is full', async () => {
        failAllWrites(new Error('QUOTA_BYTES quota exceeded'))

        await expect(runtime.storage.set('notes', 'hello')).rejects.toThrow(
            await storageFullMessage(),
        )
    })

    it('keeps the previous data when the new data cannot be saved', async () => {
        await runtime.storage.set('notes', 'old')

        failAllWrites(new Error('QUOTA_BYTES quota exceeded'))

        await expect(runtime.storage.set('notes', 'new')).rejects.toThrow()

        expect(await runtime.storage.get('notes')).toEqual(['old'])
    })
})

describe('saving a group when the write fails', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('does not register the group id when the group was not saved', async () => {
        const group = fakeGroup({ id: 7 })

        failWritesFor(new Error('QUOTA_BYTES quota exceeded'), '7')

        await expect(groupStorage.save(group)).rejects.toThrow()

        expect(await groupIdsStorage.getAll()).toEqual([])
        expect(await groupStorage.getAll()).toEqual([])
    })

    it('keeps the stored group when its update cannot be saved', async () => {
        const group = fakeGroup({ id: 8, name: 'old name' })

        await groupStorage.save(group)

        failWritesFor(new Error('QUOTA_BYTES quota exceeded'), '8')

        await expect(
            groupStorage.save({ ...group, name: 'new name' }),
        ).rejects.toThrow()

        const [stored] = await groupStorage.getAll()

        expect(stored.name).toEqual('old name')
    })
})

describe.each([
    {
        name: 'chrome',
        getAdapter: getChromeRuntimeAdapter,
        stubStorage: stubChromeStorage,
    },
    {
        name: 'firefox',
        getAdapter: getFirefoxRuntimeAdapter,
        stubStorage: stubFirefoxStorage,
    },
])(
    '$name storage when the browser rejects the write',
    ({ getAdapter, stubStorage }) => {
        afterEach(() => {
            vi.unstubAllGlobals()
            vi.restoreAllMocks()
        })

        it('reports storage is full', async () => {
            const setFunc = vi
                .fn()
                .mockRejectedValue(new Error('QUOTA_BYTES quota exceeded'))

            stubStorage(setFunc)

            await expect(getAdapter().storage.set('notes', 'hello')).rejects.toThrow(
                await storageFullMessage(),
            )
        })

        it('reports a general save failure', async () => {
            const setFunc = vi.fn().mockRejectedValue(new Error('disk is on fire'))

            stubStorage(setFunc)

            await expect(getAdapter().storage.set('notes', 'hello')).rejects.toThrow(
                trans('save_failed'),
            )
        })
    },
)

async function storageFullMessage(): Promise<string> {
    const MB = 1024 * 1024

    return trans(
        'not_enough_storage',
        formatNumber(runtime.storage.MAX_BYTES_QUOTA / MB),
        formatNumber((await runtime.storage.getBytesInUse()) / MB),
    )
}

function stubChromeStorage(set: (items: object) => Promise<void>): void {
    vi.stubGlobal('chrome', {
        storage: {
            session: null,
            local: {
                QUOTA_BYTES: config.MAX_STORAGE_BYTES,
                get: async () => ({}),
                getBytesInUse: async () => 0,
                set,
            },
        },
    })
}

function stubFirefoxStorage(set: (items: object) => Promise<void>): void {
    vi.stubGlobal('browser', {
        storage: {
            session: null,
            local: {
                get: async () => ({}),
                set,
            },
        },
    })
}

function failAllWrites(error: Error): void {
    failWritesWhen(() => true, error)
}

function failWritesFor(error: Error, key: string): void {
    failWritesWhen(writtenKey => writtenKey === key, error)
}

function failWritesWhen(shouldFail: (key: string) => boolean, error: Error): void {
    const realStorage = localStorage

    vi.stubGlobal('localStorage', {
        get length() {
            return realStorage.length
        },
        key: (index: number) => realStorage.key(index),
        getItem: (key: string) => realStorage.getItem(key),
        removeItem: (key: string) => realStorage.removeItem(key),
        clear: () => realStorage.clear(),
        setItem: (key: string, value: string) => {
            if (shouldFail(key)) {
                throw error
            }

            realStorage.setItem(key, value)
        },
    })
}
