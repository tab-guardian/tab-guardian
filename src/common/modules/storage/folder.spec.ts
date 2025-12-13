// @vitest-environment happy-dom

import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { folderStorage } from '@common/modules/storage/folder'

describe('folder storage module', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('save()', () => {
        it('saves folder into storage', async () => {
            await folderStorage.save('Anna Photos')

            const foldersStr = localStorage.getItem('folders')

            expect(foldersStr).not.toBeNull()

            const foldersParsed = JSON.parse(foldersStr!)

            expect(foldersParsed[0]).toBeDefined()
            expect(foldersParsed[0].name).equal('Anna Photos')
        })

        it('appends folder into storage to other folders', async () => {
            await folderStorage.save('Serhii')
            await folderStorage.save('Anna')

            const foldersStr = localStorage.getItem('folders')

            expect(foldersStr).not.toBeNull()

            const foldersParsed = JSON.parse(foldersStr!)

            expect(foldersParsed).toHaveLength(2)
        })

        it('saving existing folder will be ignored', async () => {
            await folderStorage.save('Test')

            let folders = await folderStorage.getAll()

            expect(folders).toHaveLength(1)

            await folderStorage.save('Test')

            folders = await folderStorage.getAll()

            expect(folders).toHaveLength(1)
        })

        it('saving folder with empty name will ignore it', async () => {
            await folderStorage.save('')

            const foldersStr = localStorage.getItem('folders')
            expect(foldersStr).toBeNull()
        })
    })

    suite('getAll()', () => {
        it('loads all folders from storage', async () => {
            await folderStorage.save('Anna')
            await folderStorage.save('Serhii')

            const folders = await folderStorage.getAll()

            expect(folders).toHaveLength(2)
            expect(folders[0].name).equal('Anna')
            expect(folders[1].name).equal('Serhii')
        })

        it('returns empty array when there are not folders', async () => {
            const folders = await folderStorage.getAll()
            expect(folders).toHaveLength(0)
        })
    })

    suite('get()', () => {
        it('returns requested folder found in storage', async () => {
            await folderStorage.save('Anna')
            await folderStorage.save('Serhii')

            const folders = await folderStorage.getAll()

            const folder1 = await folderStorage.get(folders[0].id)
            const folder2 = await folderStorage.get(folders[1].id)

            expect(folder1?.name).equal('Anna')
            expect(folder2?.name).equal('Serhii')
        })

        it('returns null when not found in storage', async () => {
            const folder = await folderStorage.get(1)
            expect(folder).toBeNull()
        })
    })

    suite('delete()', () => {
        it('deletes folder', async () => {
            const folder1 = await folderStorage.save('Anna')
            const folder2 = await folderStorage.save('Serhii')

            await folderStorage.delete(folder1!.id)

            const folders = await folderStorage.getAll()

            expect(folders).toHaveLength(1)
            expect(folders[0].id).equal(folder2?.id)
        })

        it('does not delete folder for wrong id', async () => {
            await folderStorage.save('Anna')
            await folderStorage.save('Serhii')

            await folderStorage.delete(0)

            const folders = await folderStorage.getAll()

            expect(folders).toHaveLength(2)
        })
    })
})
