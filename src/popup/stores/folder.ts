import type { Folder, Group } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { folderStorage } from '@common/modules/storage/folder'
import { useNotificationStore } from '@/stores/notification'
import { useGroupStore } from './group'

export const useFolderStore = defineStore('folder', () => {
    const notificationStore = useNotificationStore()
    const groupStore = useGroupStore()

    const folders = ref<Folder[]>([])
    const loading = ref<boolean>(false)

    async function load(): Promise<void> {
        loading.value = true
        folders.value = await folderStorage.getAll()
        loading.value = false
    }

    async function deleteFolder(id: number): Promise<void> {
        // 1. Delete all groups inside of it
        // ---- groupStore.delteGroup(id)
        // 2. Delete passwords from storage of private groups
        // ---- await passwordStorage.delete(props.folder.id)

        await folderStorage.delete(id)
        await notificationStore.recalculateNotification()
    }

    return {
        folders,
        loading,
        load,
        deleteFolder,
    }
})
