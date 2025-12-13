import type { Folder } from '@common/types'
import { runtime } from '@common/modules/runtime'
import { logger } from '@common/modules'
import { generateId } from '@common/modules/group'

export const folderStorage = {
    async save(name: string): Promise<Folder | null> {
        if (name === '') {
            logger().warn('Folder cannot be saved with empty name')
            return null
        }

        const folders = await this.getAll()
        const exists = folders.some(f => f.name === name)

        if (exists) {
            return null
        }

        const folder: Folder = {
            id: generateId(),
            name,
            updatedAt: Date.now(),
        }

        folders.push(folder)

        await runtime.storage.set<Folder[]>('folders', folders)

        return folder
    },

    async getAll(): Promise<Folder[]> {
        const items = await runtime.storage.get<Folder[]>('folders')
        return items[0] || []
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
