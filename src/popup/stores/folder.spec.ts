// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFolderStore } from '@/stores/folder'
import { folderStorage } from '@common/modules/storage/folder'
import { fakeGroup } from '@common/modules/fake'
import { groupStorage } from '@common/modules/storage/group'

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

        it('deletes groups attatched to deleted folder', async () => {
            const folderStore = useFolderStore()

            let folder = await folderStorage.save('Actresses')

            const sedneyGroup = fakeGroup({
                name: 'Sydney Sweeney',
                folderId: folder!.id,
            })

            const amyGroup = fakeGroup({
                name: 'Amy Adams',
                folderId: folder!.id,
            })

            await groupStorage.save(sedneyGroup)
            await groupStorage.save(amyGroup)

            await folderStore.deleteFolder(folder!.id)

            const groups = await groupStorage.getAll()

            expect(groups).toHaveLength(0)
        })
    })
})
