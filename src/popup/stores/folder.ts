import type { Folder } from '@common/types'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { folderStorage } from '@common/modules/storage/folder'
import { useNotificationStore } from '@/stores/notification'
import { groupStorage } from '@common/modules/storage/group'
import { useGroupStore } from '@/stores/group'

export const useFolderStore = defineStore('folder', () => {
    const notificationStore = useNotificationStore()
    const groupStore = useGroupStore()
    const route = useRoute()

    const folders = ref<Folder[]>([])
    const loading = ref<boolean>(false)

    const folder = computed<Folder | null>(() => {
        const id = route.params.id
        const parsedId = id ? Number(id) : null
        return folders.value.find(f => f.id == parsedId) || null
    })

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

    return {
        folder,
        folders,
        loading,
        load,
        deleteFolder,
    }
})
