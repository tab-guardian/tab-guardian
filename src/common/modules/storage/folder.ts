import type { Folder } from '@common/types'
import { runtime } from '@common/modules/runtime'
import { logger } from '@common/modules'
import { forceUniqueName } from '@common/modules/group'

export const folderStorage = {
    async save(folder: Folder): Promise<Folder | null> {
        const folders = await this.getAll()
        const exists = folders.some(f => f.name === folder.name)

        if (exists) {
            throw new Error('Folder already exists, it should not happen')
        }

        folders.push(folder)

        await runtime.storage.set<Folder[]>('folders', folders)

        return folder
    },

    async getAll(): Promise<Folder[]> {
        const items = await runtime.storage.get<Folder[]>('folders')
        return items[0] || []
    },

    async rename(id: number, newName: string): Promise<void> {
        const folders = await this.getAll()
        const folder = folders.find(f => f.id === id)

        if (!folder) {
            logger().warn('Folder not found')
            return
        }

        const takenNames = new Set(folders.filter(f => f.id !== id).map(f => f.name))

        folder.name = forceUniqueName(newName, takenNames)
        folder.updatedAt = Date.now()

        await runtime.storage.set<Folder[]>('folders', folders)
    },

    async get(id: number): Promise<Folder | null> {
        const folders = await this.getAll()
        return folders.find(f => f.id === id) || null
    },

    async delete(id: number): Promise<void> {
        const folders = await this.getAll()
        const filtered = folders.filter(f => f.id !== id)
        await runtime.storage.set<Folder[]>('folders', filtered)
    },
}
