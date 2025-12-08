import type { Folder } from '@common/types'
import { runtime } from '@common/modules/runtime'
import { logger } from '@common/modules'

export const folderStorage = {
    async save(name: string): Promise<void> {
        if (name === '') {
            logger().warn('Folder cannot be saved with empty name')
            return
        }

        const folders = await this.getAll()
        const exists = folders.some(f => f.name === name)

        if (exists) {
            return
        }

        folders.push({
            name,
            updatedAt: Date.now(),
            groupIds: [],
        })

        await runtime.storage.set<Folder[]>('folders', folders)
    },

    async getAll(): Promise<Folder[]> {
        const items = await runtime.storage.get<Folder[]>('folders')
        return items[0] || []
    },
}
