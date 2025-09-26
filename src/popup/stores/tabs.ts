import type { Group } from '@/types'
import { defineStore } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { useSettingsStore } from '@/stores/settings'
import { showToast } from '@common/modules/showToast'
import { getCurrentLinks } from '@/modules/tabs/getCurrentLinks'
import { restoreTabs } from '@/modules/tabs/restoreTabs'
import { closeTabs } from '@/modules/tabs/closeTabs'
import { getPasswordFromStorage } from '@common/modules/storage/password'
import { error } from '@common/modules/error'

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
        const encrypted = await groupStore.encrypt(group, userPass || pass)

        if (!encrypted) {
            error.info(`Group ${group.id} wasn't encrypted`)
            return false
        }

        await groupStore.save(encrypted)

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
            await groupStore.saveLinksTo(group.id, links)
        }

        if (closeAllTabs) {
            await closeTabs(links.map(l => l.id))
        }

        showToast(trans('tabs_now_saved'))
    }

    return {
        openTabs,
        stashTabs,
        openAndDeleteTabs,
    }
})
