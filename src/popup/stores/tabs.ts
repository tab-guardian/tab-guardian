import type { OpenTabMessage } from '@/types/messages'
import type { Link, Group } from '@/types'
import { defineStore } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import showToast from '@/modules/showToast'
import getCurrentLinks from '@/modules/tabs/getCurrentLinks'
import isDevelopment from '@/modules/isDevelopment'

export const useTabsStore = defineStore('tabs', () => {
    const groupStore = useGroupStore()
    const { trans } = useTransStore()

    function openAll(links: Link[]): boolean {
        if (isDevelopment()) {
            showToast('Cannot open tabs in development', 'error')
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

    function openTabs(links: Link[]): boolean {
        const opened = openAll(links)

        if (opened) {
            showToast(trans('Tabs opened'))
        }

        return opened
    }

    function openAndDeleteTabs(group: Group): void {
        const opened = openTabs(group.links)

        if (!opened) {
            return
        }

        groupStore.deleteGroup(group.id)

        showToast(trans('Tabs opened and group deleted'))
    }

    async function stashTabs(group: Group, closeTabs: boolean): Promise<void> {
        const links = await getCurrentLinks({ closeTabs })

        if (!links.length) {
            showToast(trans('No tabs to save'), 'error')
            return
        }

        groupStore.deleteAllLinks(group.id)
        groupStore.prependLinksTo(group.id, links)

        showToast(trans('Tabs have been saved'))
    }

    return {
        openTabs,
        stashTabs,
        openAndDeleteTabs,
    }
})
