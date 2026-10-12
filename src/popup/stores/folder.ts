import type { Folder } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { folderStorage } from '@common/modules/storage/folder'
import { useNotificationStore } from '@/stores/notification'
import { forceUniqueName } from '@common/modules/group'
import { groupStorage } from '@common/modules/storage/group'
import { useGroupStore } from '@/stores/group'
import { getDefaultName, logger } from '@common/modules'
import { generateId } from '@common/modules/group'

export const useFolderStore = defineStore('folder', () => {
    const notificationStore = useNotificationStore()
    const groupStore = useGroupStore()

    const folders = ref<Folder[]>([])
    const loading = ref<boolean>(false)
    const selectedFolder = ref<Folder | null>(null)

    async function load(): Promise<void> {
        loading.value = true
        folders.value = await folderStorage.getAll()
        loading.value = false
    }

    async function deleteFolder(id: number): Promise<void> {
        const groups = await groupStorage.retrieveFolder(id)

        // Delete all groups inside of a folder first
        for (const group of groups) {
            await groupStore.deleteGroup(group.id)
        }

        await folderStorage.delete(id)
        await notificationStore.recalculateNotification()
    }

    async function createMany(folders: Folder[]): Promise<void> {
        try {
            for (const folder of folders) {
                await create(folder, false)
            }
        } catch (err) {
            logger().error(err)
        }

        await load()
        await notificationStore.recalculateNotification()
    }

    async function create(
        folderOrName: string | Folder,
        loadFolders = true,
    ): Promise<void> {
        const folder =
            typeof folderOrName === 'object'
                ? folderOrName
                : generateEmptyFolder(folderOrName)

        // Same id means same folder, it is already stored
        const existingFolder = await folderStorage.get(folder.id)

        if (existingFolder) {
            return
        }

        if (folder.name === '') {
            folder.name = getDefaultName('Folder')
        }

        const folders = await folderStorage.getAll()
        const takenNames = new Set(folders.map(f => f.name))

        folder.name = forceUniqueName(folder.name, takenNames)

        await folderStorage.save(folder)

        if (loadFolders) {
            await load()
            await notificationStore.recalculateNotification()
        }
    }

    function generateEmptyFolder(name: string): Folder {
        return {
            id: generateId(),
            name,
            updatedAt: Date.now(),
        }
    }

    return {
        selectedFolder,
        folders,
        loading,
        createMany,
        create,
        load,
        deleteFolder,
    }
})
