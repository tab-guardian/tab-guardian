// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { saveGroupToStorage } from '@common/modules/storage/group'
import { fakeGroup } from '@common/modules/fake'

describe('storage/group', () => {
    beforeEach(() => setActivePinia(createPinia()))

    suite('saveGroupToStorage()', () => {
        it('saves group into storage', async () => {
            const group = fakeGroup()
            await saveGroupToStorage(group)

            const itemStr = localStorage.getItem(group.id.toString())

            expect(itemStr).not.toBeNull()

            const itemParsed = JSON.parse(itemStr!)

            expect(itemParsed.id).equal(group.id)
            expect(itemParsed.name).equal(group.name)
        })
    })
})
