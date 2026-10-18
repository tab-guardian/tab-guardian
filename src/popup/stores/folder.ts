import type { Folder } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { folderStorage } from '@common/modules/storage/folder'
import { useNotificationStore } from '@/stores/notification'
import { forceUniqueName } from '@common/modules/group'
import { useGroupStore } from '@/stores/group'
import { getDefaultName, logger } from '@common/modules'
import { generateUniqueId } from '@common/modules/group'

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

    function get(nameOrId: string | number): Folder | undefined {
        return folders.value.find(f => {
            return typeof nameOrId === 'string'
                ? f.name === nameOrId
                : f.id === nameOrId
        })
    }

    async function deleteFolder(id: number): Promise<void> {
        const groups = groupStore.folderGroups(id)

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
        if (loading.value) {
            const msg = `Cannot create folder ${folderOrName}. The loading is still active`
            logger().info(msg)
            return
        }

        loading.value = true

        try {
            await _persistCreateFolder(folderOrName, loadFolders)
        } finally {
            loading.value = false
        }
    }

    async function _persistCreateFolder(
        folderOrName: string | Folder,
        loadFolders = true,
    ): Promise<void> {
        const folders = await folderStorage.getAll()

        const folder =
            typeof folderOrName === 'object'
                ? folderOrName
                : generateEmptyFolder(folderOrName, new Set(folders.map(f => f.id)))

        // Same id means same folder, it is already stored
        const existingFolder = folders.find(f => f.id === folder.id)

        if (!existingFolder) {
            if (folder.name === '') {
                folder.name = getDefaultName('Folder')
            }

            const takenNames = new Set(folders.map(f => f.name))

            folder.name = forceUniqueName(folder.name, takenNames)

            await folderStorage.save(folder)
        }

        if (loadFolders) {
            await load()
            await notificationStore.recalculateNotification()
        }
    }

    function generateEmptyFolder(
        name: string,
        takenIds: ReadonlySet<number>,
    ): Folder {
        return {
            id: generateUniqueId(takenIds),
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
        get,
        load,
        deleteFolder,
    }
})
