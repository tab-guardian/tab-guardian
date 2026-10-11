import type { Folder } from '@common/types'
import { runtime } from '@common/modules/runtime'
import { logger } from '@common/modules'
import { generateId } from '@common/modules/group'
import { getDefaultName } from '@common/modules'

export const folderStorage = {
    generateEmptyFolder(name: string): Folder {
        if (name === '') {
            name = getDefaultName('Folder')
        }

        return {
            id: generateId(),
            name,
            updatedAt: Date.now(),
        }
    },

    async save(arg: string | Folder): Promise<Folder | null> {
        const folder = typeof arg === 'object'
            ? arg
            : this.generateEmptyFolder(arg)

        const folders = await this.getAll()
        const exists = folders.some(f => f.name === folder.name)

        if (exists) {
            logger().warn('Folder already exists')
            return null
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

        folder.name = newName
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
