import type { Folder, Group } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { folderStorage } from '@common/modules/storage/folder'

export const useFolderStore = defineStore('folder', () => {
    const folders = ref<Folder[]>([])
    const loading = ref<boolean>(false)

    async function load(): Promise<void> {
        loading.value = true
        folders.value = await folderStorage.getAll()
        loading.value = false
    }

    return {
        folders,
        loading,
        load,
    }
})
