import type { Link } from '@/types'
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import getCurrentLinks from '@/modules/getCurrentLinks'

export const useSelectTabsModalStore = defineStore('selectTabsModalStore', () => {
    const isOpen = ref<boolean>(true)
    const links = ref<Link[]>([])

    onMounted(() => fetchLinks())

    function fetchLinks(): void {
        getCurrentLinks({ closeTabs: false })
            .then(items => links.value = items)
    }

    return {
        links,
        isOpen,
    }
})