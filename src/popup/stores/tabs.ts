import type { Group } from '@/types'
import { defineStore } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useSettingsStore } from '@/stores/settings'
import showToast from '@common/modules/showToast'
import getCurrentLinks from '@/modules/tabs/getCurrentLinks'
import restoreTabs from '@/modules/tabs/restoreTabs'

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

        if (popupStore.popups.enterPassword.password) {
            restoreTabs(group.links)
            groupStore.encryptGroupById(
                group.id,
                popupStore.popups.enterPassword.password,
            )
            return true
        }

        if (!group.isPrivate) {
            restoreTabs(group.links)
            return true
        }

        popupStore.openPopup('enterPassword', popups => {
            const pass = popups.enterPassword.password

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
        groupStore.deleteGroup(group.id)
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
