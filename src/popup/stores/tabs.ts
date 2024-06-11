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

    function openTabs(group: Group): boolean {
        if (!settingsStore.settings.encryptAfterRestore) {
            restoreTabs(group.links)
            return true
        }

        const pass = popupStore.popups.enterPassword.passwords[group.id]

        if (pass) {
            restoreTabs(group.links)

            groupStore.encryptGroupById(group.id, pass)

            return true
        }

        if (!group.isPrivate) {
            restoreTabs(group.links)
            return true
        }

        popupStore.openPopup('enterPassword', popups => {
            const pass = popups.enterPassword.passwords[group.id]

            if (!pass) {
                return
            }

            restoreTabs(group.links)
            groupStore.encryptGroupById(group.id, pass)
        })

        return false
    }

    async function openAndDeleteTabs(group: Group): Promise<void> {
        await restoreTabs(group.links)
        await groupStore.deleteGroup(group.id)
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
