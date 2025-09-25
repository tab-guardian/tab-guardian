import type { Link, SelectTabsOperation } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { usePopupStore } from '@/stores/popup'
import { getCurrentLinks } from '@/modules/tabs/getCurrentLinks'

type SelectLinksParams = {
    operation: SelectTabsOperation
    groupId?: number
    selectAll?: boolean
}

export const useSelectTabsStore = defineStore('selectTabs', () => {
    const links = ref<Link[]>([])
    const selectedIds = ref<number[]>([])
    const targetGroupId = ref<number | null>(null)
    const loading = ref<boolean>(false)
    const router = useRouter()
    const { closeAllPopups } = usePopupStore()

    // It indicates whether we are adding tabs or creating a new group
    const operation = ref<SelectTabsOperation>('creating')

    function fetchLinks(selectAll?: boolean): void {
        getCurrentLinks()
            .then(items => {
                links.value = items

                if (selectAll) {
                    selectedIds.value = items.map(l => l.id)
                }
            })
            .finally(() => (loading.value = false))
    }

    function showView(param: SelectLinksParams): void {
        if (param.groupId) {
            targetGroupId.value = param.groupId
        }

        operation.value = param.operation

        closeAllPopups()

        fetchLinks(param.selectAll)
        router.push({ name: 'select-tabs' })
    }

    function getSelectedLinks(): Link[] {
        return links.value.filter(ln => selectedIds.value.includes(ln.id))
    }

    function closeTabsModal(): void {
        links.value = []
        selectedIds.value = []
        targetGroupId.value = null
        router.go(-1)
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
        targetGroupId,
        operation,
        toggleSelect,
        selectAll,
        deselectAll,
        closeTabsModal,
        showView,
        getSelectedLinks,
    }
})
