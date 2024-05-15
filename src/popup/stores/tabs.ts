import type { Link } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTabsStore = defineStore('tabs', () => {
    function openTabs(links: Link[]): void {
        links.forEach(link => {
            console.log(link.url)
            window.open(link.url, '_blank')
        })
    }

    return {
        openTabs,
    }
})
