import type { Folder } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { folderStorage } from '@common/modules/storage/folder'
import { useNotificationStore } from '@/stores/notification'
import { groupStorage } from '@common/modules/storage/group'
import { useGroupStore } from '@/stores/group'
import { logger } from '@common/modules'

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

    async function saveMany(folders: Folder[]): Promise<void> {
        try {
            for (const folder of folders) {
                await save(folder, false)
            }
        } catch (err) {
            logger().error(err)
        }

        await load()
        await notificationStore.recalculateNotification()
    }

    async function save(folder: Folder, loadFolders = true): Promise<void> {
        folder.name = await forceUniqueName(folder.name)

        await folderStorage.save(folder)

        if (loadFolders) {
            await load()
            await notificationStore.recalculateNotification()
        }
    }

    // Returns a new name for given folder name
    async function forceUniqueName(oldName: string, duplicateIndex = 1): Promise<string> {
        const folders = await folderStorage.getAll()
        const nameExists = folders.some(folder => folder.name === oldName)

        if (!nameExists) {
            return oldName
        }

        const newName = `${oldName} (Copy ${duplicateIndex})`

        return forceUniqueName(newName, ++duplicateIndex)
    }

    return {
        selectedFolder,
        folders,
        loading,
        saveMany,
        load,
        deleteFolder,
    }
})
