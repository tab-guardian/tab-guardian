// @vitest-environment happy-dom

import type { Folder } from '@common/types'
import { describe, it, expect, beforeEach, suite } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFolderStore } from '@/stores/folder'
import { folderStorage } from '@common/modules/storage/folder'

function fakeFolder(fields?: Partial<Folder>): Folder {
    const id = fields?.id ?? Math.floor(Date.now() + Math.random() * 1000)

    return {
        id,
        name: `Test folder ${id}`,
        updatedAt: Date.now(),
        ...fields,
    }
}

describe('folder store', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('saveMany()', () => {
        it('saves folders to folders state', async () => {
            const folderStore = useFolderStore()

            expect(folderStore.folders).toHaveLength(0)

            await folderStore.saveMany([
                fakeFolder({ name: 'Serhii' }),
                fakeFolder({ name: 'Anna' }),
            ])

            expect(folderStore.folders).toHaveLength(2)
        })

        it('saves folders to local storage', async () => {
            const folderStore = useFolderStore()

            await folderStore.saveMany([fakeFolder({ name: 'Anna Photos' })])

            const folders = await folderStorage.getAll()

            expect(folders).toHaveLength(1)
            expect(folders[0]?.name).equal('Anna Photos')
        })

        it('saves duplicate name as first free "<name> (Copy n)" starting at 1', async () => {
            const folderStore = useFolderStore()
            const folderName = 'Work'

            await folderStorage.save(folderName)
            await folderStorage.save(`${folderName} (Copy 100)`)

            await folderStore.saveMany([fakeFolder({ name: folderName })])

            const folderNames = folderStore.folders.map(f => f.name)

            expect(folderNames).toContain(folderName)
            expect(folderNames).toContain(`${folderName} (Copy 100)`)
            expect(folderNames).toContain(`${folderName} (Copy 1)`)
        })

        it('numbers from the base name when a copy already exists', async () => {
            const folderStore = useFolderStore()
            const folderName = 'Work'

            await folderStorage.save(folderName)
            await folderStorage.save(`${folderName} (Copy 1)`)

            await folderStore.saveMany([fakeFolder({ name: folderName })])

            const folderNames = folderStore.folders.map(f => f.name)

            expect(folderNames).toContain(folderName)
            expect(folderNames).toContain(`${folderName} (Copy 1)`)
            expect(folderNames).toContain(`${folderName} (Copy 2)`)
        })

        it('keeps the incoming folder id when renaming a duplicate', async () => {
            const folderStore = useFolderStore()
            const folderName = 'Work'
            const incomingId = 222

            await folderStorage.save(folderName)

            await folderStore.saveMany([
                fakeFolder({ id: incomingId, name: folderName }),
            ])

            const folderCopy = folderStore.folders.find(
                f => f.name === `${folderName} (Copy 1)`,
            )

            expect(folderCopy).toBeDefined()
            expect(folderCopy!.id).toEqual(incomingId)
        })

        it('numbers duplicates within the same batch', async () => {
            const folderStore = useFolderStore()
            const folderName = 'Work'

            await folderStore.saveMany([
                fakeFolder({ id: 11, name: folderName }),
                fakeFolder({ id: 22, name: folderName }),
            ])

            const folderNames = folderStore.folders.map(f => f.name)

            expect(folderNames).toContain(folderName)
            expect(folderNames).toContain(`${folderName} (Copy 1)`)
        })
    })
})
