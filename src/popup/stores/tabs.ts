import type { Group } from '@/types'
import { defineStore } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useSettingsStore } from '@/stores/settings'
import showToast from '@common/modules/showToast'
import getCurrentLinks from '@/modules/tabs/getCurrentLinks'
import restoreTabs from '@/modules/tabs/restoreTabs'
import closeTabs from '@/modules/tabs/closeTabs'

export const useTabsStore = defineStore('tabs', () => {
    const groupStore = useGroupStore()
    const popupStore = usePopupStore()
    const settingsStore = useSettingsStore()
    const { trans } = useTransStore()

    async function openTabs(group: Group): Promise<boolean> {
        if (!settingsStore.settings.encryptAfterRestore) {
            await restore(group)
            return true
        }

        const pass = popupStore.popups.enterPassword.passwords[group.id]

        if (pass) {
            await restore(group)
            groupStore.encryptGroupById(group.id, pass, pass)

            return true
        }

        if (!group.isPrivate) {
            await restore(group)
            return true
        }

        popupStore.openPopup('enterPassword', async popups => {
            const pass = popups.enterPassword.passwords[group.id]

            if (!pass) {
                return
            }

            await restore(group)
            groupStore.encryptGroupById(group.id, pass, pass)
        })

        return false
    }

    async function restore(group: Group): Promise<void> {
        await restoreTabs(group.links)
        await groupStore.updateUpdatedAt(group.id)
    }

    async function openAndDeleteTabs(group: Group): Promise<void> {
        await groupStore.deleteGroup(group.id)
        await restoreTabs(group.links)
    }

    async function stashTabs(group: Group, closeAllTabs: boolean): Promise<void> {
        const links = await getCurrentLinks()

        if (!links.length) {
            showToast(trans('No tabs to save'), 'error')
            return
        }

        if (links.length > 0) {
            await groupStore.deleteAllLinks(group.id)
            await groupStore.prependLinksTo(group.id, links)
        }

        if (closeAllTabs) {
            await closeTabs(links.map(l => l.id))
        }

        showToast(trans('Tabs have been saved'))
    }

    return {
        openTabs,
        stashTabs,
        openAndDeleteTabs,
    }
})
