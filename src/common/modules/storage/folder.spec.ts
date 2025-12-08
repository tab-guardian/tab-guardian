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
})
