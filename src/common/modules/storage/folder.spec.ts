// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { fakeFolder } from '@common/modules/fake'
import { createPinia, setActivePinia } from 'pinia'
import { folderStorage } from '@common/modules/storage/folder'

describe('folder storage module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('save()', () => {
        it('saves folder into storage', async () => {
            const folder = fakeFolder()
            await folderStorage.save(folder)

            const foldersStr = localStorage.getItem('folders')

            expect(foldersStr).not.toBeNull()

            const foldersParsed = JSON.parse(foldersStr!)

            expect(foldersParsed[0]).toBeDefined()
            expect(foldersParsed[0].name).equal(folder.name)
            expect(foldersParsed[0].updatedAt).equal(folder.updatedAt)
        })

        it('appends folder into storage to other folders', async () => {
            const folder1 = fakeFolder()
            await folderStorage.save(folder1)

            const folder2 = fakeFolder()
            await folderStorage.save(folder2)

            const foldersStr = localStorage.getItem('folders')

            expect(foldersStr).not.toBeNull()

            const foldersParsed = JSON.parse(foldersStr!)

            expect(foldersParsed).toHaveLength(2)
        })

        it('saving existing folder will update fields', async () => {
            const folder1 = fakeFolder({
                name: 'Anna',
                groupIds: [1, 2],
            })

            await folderStorage.save(folder1)

            let folders = await folderStorage.getAll()

            expect(folders).toHaveLength(1)
            expect(folders[0].updatedAt).equal(folder1.updatedAt)
            expect(folders[0].groupIds).toStrictEqual(folder1.groupIds)

            const folder2 = fakeFolder({
                name: 'Anna',
                groupIds: [2, 3],
            })

            await folderStorage.save(folder2)

            folders = await folderStorage.getAll()

            expect(folders).toHaveLength(1)
            expect(folders[0].updatedAt).equal(folder2.updatedAt)
            expect(folders[0].groupIds).toStrictEqual(folder2.groupIds)
        })

        it('saving folder with empty name will ignore it', async () => {
            const folder = fakeFolder({ name: '' })
            await folderStorage.save(folder)

            const foldersStr = localStorage.getItem('folders')
            expect(foldersStr).toBeNull()
        })
    })

    suite('getAll()', () => {
        it('loads all folders from storage', async () => {
            const folder1 = fakeFolder()
            const folder2 = fakeFolder()

            await folderStorage.save(folder1)
            await folderStorage.save(folder2)

            const folders = await folderStorage.getAll()

            expect(folders).toHaveLength(2)
            expect(folders[0].name).equal(folder1.name)
            expect(folders[1].name).equal(folder2.name)
        })

        it('returns empty array when there are not folders', async () => {
            const folders = await folderStorage.getAll()
            expect(folders).toHaveLength(0)
        })
    })
})
