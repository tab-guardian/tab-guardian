import type { Link } from '@/types'
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import getCurrentLinks from '@/modules/getCurrentLinks'

export const useSelectTabsModalStore = defineStore('selectTabsModalStore', () => {
    const isOpen = ref<boolean>(true)
    const links = ref<Link[]>([])
    const selectedIds = ref<number[]>([])
    const loading = ref<boolean>(false)

    onMounted(() => fetchLinks())

    function fetchLinks(): void {
        getCurrentLinks({ closeTabs: false })
            .then(items => links.value = items)
            .finally(() => loading.value = false)
    }

    function toggleSelect(id: number): void {
        const index = selectedIds.value.indexOf(id)

        if (index === -1) {
            selectedIds.value.push(id)
            return
        }

        // Remove the item from the array
        selectedIds.value.splice(index, 1)
    }

    return {
        links,
        selectedIds,
        loading,
        isOpen,
        toggleSelect,
    }
})