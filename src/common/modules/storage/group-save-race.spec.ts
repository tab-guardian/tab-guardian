// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { fakeGroup } from '@common/modules/fake'
import { runtime } from '@common/modules/runtime'
import { groupStorage } from '@common/modules/storage/group'

describe('groupStorage.save() remove-then-set race', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('re-saving an existing group does not call remove', async () => {
        const group = fakeGroup()
        await groupStorage.save(group)

        const removeSpy = vi.spyOn(runtime.storage, 'remove')

        await groupStorage.save({ ...group, name: 'updated' })

        expect(removeSpy).not.toHaveBeenCalled()
    })

    it('keeps the old group stored until the new one is written', async () => {
        const group = fakeGroup()
        const key = group.id.toString()
        await groupStorage.save(group)

        // Remember what is stored at the moment the group is being written
        let storedDuringWrite: unknown[] = []
        const realSet = runtime.storage.set.bind(runtime.storage)

        vi.spyOn(runtime.storage, 'set').mockImplementation(
            async (writtenKey: string, value: unknown) => {
                if (writtenKey === key) {
                    storedDuringWrite = await runtime.storage.get(key)
                }

                return realSet(writtenKey, value as never)
            },
        )

        await groupStorage.save({ ...group, name: 'updated' })

        // With remove-then-set nothing would be stored here,
        // so a crash in this window would lose the group
        expect(storedDuringWrite).toHaveLength(1)
    })
})
