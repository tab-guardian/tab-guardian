// @vitest-environment happy-dom

import { fakeFolder } from '@common/modules/fake'
import { describe, it, expect, beforeEach, suite } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFolderStore } from '@/stores/folder'
import { folderStorage } from '@common/modules/storage/folder'
import { stubGenerateId } from '@common/modules/testUtils'

describe('folder store', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('create()', () => {
        it('ignores second create while first is still running', async () => {
            const folderStore = useFolderStore()

            const first = folderStore.create(fakeFolder({ name: 'Work' }))
            await folderStore.create(fakeFolder({ name: 'Work' }))
            await first

            expect(folderStore.folders).toHaveLength(1)
            expect(folderStore.folders[0]?.name).equal('Work')
        })

        it('saves folder by name', async () => {
            const folderStore = useFolderStore()
            const folderName = 'Anna Photos'

            await folderStore.create(folderName)

            expect(folderStore.folders).toHaveLength(1)
            expect(folderStore.folders[0]?.name).equal(folderName)
        })

        it('saves empty name with default name', async () => {
            const folderStore = useFolderStore()

            await folderStore.create('')

            expect(folderStore.folders).toHaveLength(1)
            expect(folderStore.folders[0]?.name).toMatch(/^Folder /)
        })

        it('saves duplicate name with copy suffix', async () => {
            const folderStore = useFolderStore()
            const folderName = 'Work'

            await folderStore.create(folderName)
            await folderStore.create(folderName)

            const folderNames = folderStore.folders.map(f => f.name)

            expect(folderNames).toContain(folderName)
            expect(folderNames).toContain(`${folderName} (Copy 1)`)
        })

        it('generates another id when it is taken', async () => {
            const folderStore = useFolderStore()

            await folderStore.create('Work')

            const existingFolder = folderStore.get('Work')!
            const freshId = 777

            stubGenerateId([existingFolder.id, freshId])

            await folderStore.create('Personal')

            expect(folderStore.get('Personal')!.id).equal(freshId)
            expect(folderStore.get('Work')!.id).equal(existingFolder.id)
        })
    })

    suite('get()', () => {
        it('returns folder with matching name', async () => {
            const folderStore = useFolderStore()

            await folderStore.createMany([
                fakeFolder({ name: 'Serhii' }),
                fakeFolder({ name: 'Anna' }),
            ])

            const actual = folderStore.get('Anna')

            expect(actual).not.toBeUndefined()
            expect(actual?.name).equal('Anna')
        })

        it('returns folder with matching id', async () => {
            const folderStore = useFolderStore()

            await folderStore.createMany([
                fakeFolder({ id: 11, name: 'Serhii' }),
                fakeFolder({ id: 22, name: 'Anna' }),
            ])

            const actual = folderStore.get(22)

            expect(actual).not.toBeUndefined()
            expect(actual?.name).equal('Anna')
        })

        it('returns undefined for missing name', async () => {
            const folderStore = useFolderStore()
            await folderStore.create(fakeFolder({ name: 'Serhii' }))
            expect(folderStore.get('Anna')).toBeUndefined()
        })

        it('returns undefined for missing id', async () => {
            const folderStore = useFolderStore()
            await folderStore.create(fakeFolder({ id: 11, name: 'Serhii' }))
            expect(folderStore.get(22)).toBeUndefined()
        })
    })

    suite('createMany()', () => {
        it('saves folders to folders state', async () => {
            const folderStore = useFolderStore()

            expect(folderStore.folders).toHaveLength(0)

            await folderStore.createMany([
                fakeFolder({ name: 'Serhii' }),
                fakeFolder({ name: 'Anna' }),
            ])

            expect(folderStore.folders).toHaveLength(2)
        })

        it('saves folders to local storage', async () => {
            const folderStore = useFolderStore()

            await folderStore.create(fakeFolder({ name: 'Anna Photos' }))

            const folders = await folderStorage.getAll()

            expect(folders).toHaveLength(1)
            expect(folders[0]?.name).equal('Anna Photos')
        })

        it('saves duplicate name as first free "<name> (Copy n)" starting at 1', async () => {
            const folderStore = useFolderStore()
            const folderName = 'Work'

            await folderStore.createMany([
                fakeFolder({ name: folderName }),
                fakeFolder({ name: `${folderName} (Copy 100)` }),
            ])

            await folderStore.create(fakeFolder({ name: folderName }))

            const folderNames = folderStore.folders.map(f => f.name)

            expect(folderNames).toContain(folderName)
            expect(folderNames).toContain(`${folderName} (Copy 100)`)
            expect(folderNames).toContain(`${folderName} (Copy 1)`)
        })

        it('numbers from the base name when a copy already exists', async () => {
            const folderStore = useFolderStore()
            const folderName = 'Work'

            await folderStore.createMany([
                fakeFolder({ name: folderName }),
                fakeFolder({ name: `${folderName} (Copy 1)` }),
            ])

            await folderStore.create(fakeFolder({ name: folderName }))

            const folderNames = folderStore.folders.map(f => f.name)

            expect(folderNames).toContain(folderName)
            expect(folderNames).toContain(`${folderName} (Copy 1)`)
            expect(folderNames).toContain(`${folderName} (Copy 2)`)
        })

        it('keeps the incoming folder id when renaming a duplicate', async () => {
            const folderStore = useFolderStore()
            const folderName = 'Work'
            const incomingId = 222

            await folderStore.create(fakeFolder({ name: folderName }))

            await folderStore.createMany([
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

            await folderStore.createMany([
                fakeFolder({ id: 11, name: folderName }),
                fakeFolder({ id: 22, name: folderName }),
            ])

            const folderNames = folderStore.folders.map(f => f.name)

            expect(folderNames).toContain(folderName)
            expect(folderNames).toContain(`${folderName} (Copy 1)`)
        })

        it('skips folder when id already exists', async () => {
            const folderStore = useFolderStore()
            const folderName = 'Work'

            await folderStore.create(fakeFolder({ id: 1, name: folderName }))
            await folderStore.create(fakeFolder({ id: 1, name: folderName }))

            expect(folderStore.folders).toHaveLength(1)
            expect(folderStore.folders[0]?.name).equal(folderName)
        })

        it('keeps local name when id matches but name differs', async () => {
            const folderStore = useFolderStore()

            await folderStore.create(fakeFolder({ id: 1, name: 'Work' }))
            await folderStore.create(fakeFolder({ id: 1, name: 'Job' }))

            expect(folderStore.folders).toHaveLength(1)
            expect(folderStore.folders[0]?.name).equal('Work')
        })
    })
})
