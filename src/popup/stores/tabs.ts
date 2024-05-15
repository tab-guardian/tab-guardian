import type { OpenTabMessage } from '@/types/messages'
import type { Link, Group } from '@/types'
import { defineStore } from 'pinia'
import { useGroupStore } from '@/stores/group'
import showToast from '@/modules/showToast'

export const useTabsStore = defineStore('tabs', () => {
    const groupStore = useGroupStore()

    function openTabs(links: Link[]): boolean {
        if (!chrome.runtime) {
            showToast('Cannot open tabs in this environment', 'error')
            return false
        }

        links.forEach(link => {
            chrome.runtime.sendMessage<OpenTabMessage>({
                openTab: {
                    url: link.url,
                    active: false,
                },
            })
        })

        return true
    }

    function openAndDeleteTabs(group: Group): void {
        const opened = openTabs(group.links)

        if (!opened) {
            return
        }

        groupStore.deleteGroup(group.id)
    }

    return {
        openTabs,
        openAndDeleteTabs,
    }
})
