// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFolderStore } from '@/stores/folder'
import { folderStorage } from '@common/modules/storage/folder'

describe('folder store', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('deleteFolder()', () => {
        it('deleting folder removes it from storage', async () => {
            const folderStore = useFolderStore()
            const folder = await folderStorage.save('Crina Maria')

            await folderStore.deleteFolder(folder!.id)

            const found = await folderStorage.get(folder!.id)
            expect(found).toBeNullable()
        })
    })
})
