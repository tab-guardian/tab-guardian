import type { Link, Group } from '@/types'
import { defineStore } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { useSettingsStore } from '@/stores/settings'
import showToast from '@common/modules/showToast'
import getCurrentLinks from '@/modules/tabs/getCurrentLinks'
import isDevelopment from '@common/modules/isDevelopment'

export const useTabsStore = defineStore('tabs', () => {
    const groupStore = useGroupStore()
    const settingsStore = useSettingsStore()
    const { trans } = useTransStore()

    function openAll(group: Group): boolean {
        if (isDevelopment()) {
            showToast('Cannot open tabs in development', 'error')
            return false
        }

        group.links.forEach(link => {
            chrome.tabs.create({
                url: link.url,
                active: false,
                pinned: link.isPinned,
            })
        })

        if (settingsStore.settings.encryptAfterRestore) {
            groupStore.encryptGroupById(group.id)
        }

        return true
    }

    function openTabs(group: Group): void {
        if (openAll(group)) {
            showToast(trans('Tabs opened'))
        }
    }

    function openAndDeleteTabs(group: Group): void {
        const opened = openAll(group)

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
