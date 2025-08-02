import type { Group } from '@/types'
import { defineStore } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { useSettingsStore } from '@/stores/settings'
import { showToast } from '@common/modules/showToast'
import { getCurrentLinks } from '@/modules/tabs/getCurrentLinks'
import { restoreTabs } from '@/modules/tabs/restoreTabs'
import { closeTabs } from '@/modules/tabs/closeTabs'
import { getPasswordFromStorage } from '@common/modules/storage/getPasswordFromStorage'

export const useTabsStore = defineStore('tabs', () => {
    const groupStore = useGroupStore()
    const settingsStore = useSettingsStore()

    async function openTabs(group: Group, userPass?: string): Promise<boolean> {
        if (group.links.length === 0) {
            return false
        }

        if (!settingsStore.settings.encryptAfterRestore || !group.isPrivate) {
            await restore(group)
            return true
        }

        const pass = await getPasswordFromStorage(group.id)

        if (!pass) {
            return false
        }

        await restore(group)
        await groupStore.encryptGroupById(group.id, userPass || pass)

        return true
    }

    async function restore(group: Group): Promise<void> {
        group.updatedAt = Date.now()
        await groupStore.incrementOpenedTimes(group)
        await restoreTabs(group.links)
    }

    async function openAndDeleteTabs(group: Group): Promise<void> {
        await groupStore.deleteGroup(group.id)
        await restoreTabs(group.links)
    }

    async function stashTabs(group: Group, closeAllTabs: boolean): Promise<void> {
        const links = await getCurrentLinks()

        if (!links.length) {
            showToast(trans('no_tabs_to_save'), 'error')
            return
        }

        if (links.length > 0) {
            await groupStore.deleteAllLinks(group.id)
            await groupStore.prependLinksTo(group.id, links)
        }

        if (closeAllTabs) {
            console.log({ links })
            await closeTabs(links.map(l => l.id))
        }

        groupStore.resetNewGroup()

        showToast(trans('tabs_now_saved'))
    }

    return {
        openTabs,
        stashTabs,
        openAndDeleteTabs,
    }
})
