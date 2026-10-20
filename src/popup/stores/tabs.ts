import type { Group } from '@common/types'
import { defineStore } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules'
import { useSettingsStore } from '@/stores/settings'
import { useModalStore } from '@/stores/modal'
import { filterForbiddenLinks } from '@common/modules/group'
import { validatePassword } from '@common/modules/validation/group'
import { showToast } from '@common/modules/toast'
import { getCurrentLinks } from '@common/modules/tabs/getCurrentLinks'
import { restoreTabs } from '@common/modules/tabs/restoreTabs'
import { closeTabs } from '@common/modules/tabs/closeTabs'
import { passwordStorage } from '@common/modules/storage/password'

export const useTabsStore = defineStore('tabs', () => {
    const groupStore = useGroupStore()
    const settingsStore = useSettingsStore()
    const modalStore = useModalStore()

    async function openTabs(group: Group, userPass?: string): Promise<boolean> {
        if (group.links.length === 0) {
            return false
        }

        if (!settingsStore.settings.encryptAfterRestore || !group.isPrivate) {
            await restore(group)
            return true
        }

        const pass = await getPassword(group, userPass)

        if (!pass) {
            return false
        }

        const validationError = validatePassword(pass)

        if (validationError) {
            showToast({ text: validationError, type: 'error' })
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

        await groupStore.update(encryption.group)

        return true
    }

    // Re-locking the group needs a password. When remembering is off there is
    // nothing cached, so ask for one before opening any tab.
    async function getPassword(
        group: Group,
        userPass?: string,
    ): Promise<string | null> {
        const pass = userPass || (await passwordStorage.get(group.id))

        if (pass) {
            return pass
        }

        showToast({ text: trans('enter_your_password'), duration: 4000 })

        const resp = await modalStore.show('newPassword', {
            title: trans('enter_new_pass'),
        })

        return resp?.newPass || null
    }

    async function restore(group: Group): Promise<void> {
        group.updatedAt = Date.now()

        let openedTimes = 1

        if (group.openedTimes) {
            openedTimes = group.openedTimes + 1
        }

        group.openedTimes = openedTimes

        await groupStore.updateFields(group.id, { openedTimes })
        await restoreTabs(group.links)
    }

    async function openAndDeleteTabs(group: Group): Promise<void> {
        if (group.isPrivate) {
            await passwordStorage.delete(group.id)
        }

        const failedLinks = await restoreTabs(group.links)

        if (failedLinks.length === 0) {
            await groupStore.deleteGroup(group.id)
            return
        }

        await groupStore.updateFields(group.id, { links: failedLinks })

        const actual = (group.links.length - failedLinks.length).toString()
        const total = group.links.length.toString()

        showToast({ text: trans('only_some_tabs_restored', actual, total) })
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

        const filteredLinks = filterForbiddenLinks(links)

        if (filteredLinks.allowed.length > 0) {
            await groupStore.updateFields(group.id, { links: [] })
            await groupStore.insertLinksInto(group.id, filteredLinks.allowed)
        }

        if (closeAllTabs) {
            await closeTabs(filteredLinks.allowed.map(l => l.tabId))
        }

        showToast({ text: trans('tabs_now_saved') })
    }

    return {
        openTabs,
        stashTabs,
        openAndDeleteTabs,
    }
})
