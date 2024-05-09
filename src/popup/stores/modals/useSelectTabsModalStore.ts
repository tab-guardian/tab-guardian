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

    return {
        links,
        selectedIds,
        loading,
        isOpen,
    }
})