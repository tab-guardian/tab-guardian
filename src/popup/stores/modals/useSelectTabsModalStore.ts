import type { Link } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import getCurrentLinks from '@/modules/getCurrentLinks'

export const useSelectTabsModalStore = defineStore('selectTabsModalStore', () => {
    const isOpen = ref<boolean>(true)
    const links = ref<Link[]>([])
    const selectedIds = ref<number[]>([])
    const loading = ref<boolean>(false)

    // @todo: temporary
    fetchLinks()

    function fetchLinks(): void {
        getCurrentLinks({ closeTabs: false })
            .then(items => {
                links.value = items
                console.log(items.length)
            })
            .finally(() => loading.value = false)
    }

    function selectAll(): void {
        selectedIds.value = links.value.map(link => link.id)
    }

    function deselectAll(): void {
        selectedIds.value = []
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
        selectAll,
        deselectAll,
        fetchLinks,
    }
})