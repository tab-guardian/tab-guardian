import type { Folder } from '@common/types'
import { runtime } from '@common/modules/runtime'
import { logger } from '@common/modules'

export const folderStorage = {
    async save(folder: Folder): Promise<void> {
        if (folder.name === '') {
            logger().warn('Folder cannot be saved with empty name')
            return
        }

        const folders = await this.getAll()
        let existingFolder: Folder | null = null

        for (const fol of folders) {
            if (fol.name === folder.name) {
                existingFolder = fol
            }
        }

        if (existingFolder) {
            existingFolder.updatedAt = folder.updatedAt
            existingFolder.groupIds = folder.groupIds
        } else {
            folders.push(folder)
        }

        await runtime.storage.set<Folder[]>('folders', folders)
    },

    async getAll(): Promise<Folder[]> {
        const items = await runtime.storage.get<Folder[]>('folders')
        return items[0] || []
    },
}
