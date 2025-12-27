import type { Group } from '@common/types'
import { defineStore } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules'
import { useSettingsStore } from '@/stores/settings'
import { filterForbittenLinks } from '@common/modules/group'
import { showToast } from '@common/modules/toast'
import { getCurrentLinks } from '@common/modules/tabs/getCurrentLinks'
import { restoreTabs } from '@common/modules/tabs/restoreTabs'
import { closeTabs } from '@common/modules/tabs/closeTabs'
import { passwordStorage } from '@common/modules/storage/password'

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

        const pass = userPass || (await passwordStorage.get(group.id))

        if (!pass) {
            return false
        }

        await restore(group)
        const encryption = await groupStore.lock(group, pass)

        await passwordStorage.delete(group.id)

        showToast({
            text: encryption.message,
            type: encryption.failed ? 'error' : 'info',
        })

        if (encryption.failed) {
            return false
        }

        await groupStore.save(encryption.group)

        return true
    }

    async function restore(group: Group): Promise<void> {
        group.updatedAt = Date.now()

        let openedTimes = 1

        if (group.openedTimes) {
            openedTimes = group.openedTimes + 1
        }

        await groupStore.update(group.id, { openedTimes })

        await restoreTabs(group.links)
    }

    async function openAndDeleteTabs(group: Group): Promise<void> {
        if (group.isPrivate) {
            await passwordStorage.delete(group.id)
        }

        await groupStore.deleteGroup(group.id)
        await restoreTabs(group.links)
    }

    async function stashTabs(group: Group, closeAllTabs: boolean): Promise<void> {
        const links = await getCurrentLinks()

        if (!links.length) {
            showToast({
                text: trans('no_tabs_to_save'),
                type: 'error',
            })
            return
        }

        const filteredLinks = filterForbittenLinks(links)

        if (filteredLinks.length > 0) {
            await groupStore.update(group.id, { links: [] })
            await groupStore.insertLinksInto(group.id, filteredLinks)
        }

        if (closeAllTabs) {
            await closeTabs(filteredLinks.map(l => l.tabId))
        }

        showToast({ text: trans('tabs_now_saved') })
    }

    return {
        openTabs,
        stashTabs,
        openAndDeleteTabs,
    }
})
