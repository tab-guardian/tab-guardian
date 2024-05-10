import type { Link } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import getCurrentLinks from '@/modules/getCurrentLinks'

export const useSelectTabsModalStore = defineStore('selectTabsModalStore', () => {
    const isOpen = ref<boolean>(false)
    const links = ref<Link[]>([])
    const selectedIds = ref<number[]>([])
    const targetGroupId = ref<number | null>(null)
    const loading = ref<boolean>(false)

    function fetchLinks(): void {
        getCurrentLinks({ closeTabs: false })
            .then(items => links.value = items)
            .finally(() => loading.value = false)
    }

    function selectLinksFor(groupId: number): void {
        targetGroupId.value = groupId
        fetchLinks()
        isOpen.value = true
    }

    function getSelectedLinks(): Link[] {
        return links.value.filter(ln => selectedIds.value.includes(ln.id))
    }

    function closeModal(): void {
        isOpen.value = false
        links.value = []
        selectedIds.value = []
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
        targetGroupId,
        toggleSelect,
        selectAll,
        deselectAll,
        closeModal,
        selectLinksFor,
        getSelectedLinks,
    }
})