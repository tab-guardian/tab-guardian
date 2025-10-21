import type { Group, Link } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { trans, generateGroupId } from '@common/modules'
import { runtime } from '@common/modules/runtime'
import { useSettingsStore } from '@/stores/settings'
import { useNotificationStore } from '@/stores/notification'
import { useCryptoStore } from '@/stores/crypto'
import { useProgressStore } from '@/stores/progress'
import { useTabsStore } from '@/stores/tabs'
import { getDecryptionError } from '@/errors'
import { showToast } from '@common/modules/toast'
import { getHashedCurrentURL } from '@common/modules/url'
import { savePasswordToStorage } from '@common/modules/storage/password'
import {
    deleteAllGroupsFromStorage,
    deleteGroupFromStorage,
    getGroupsFromStorage,
    saveGroupToStorage,
} from '@common/modules/storage/group'

let isIncognitoCache: boolean | null = null

export const useGroupStore = defineStore('group', () => {
    const cryptoStore = useCryptoStore()
    const settingsStore = useSettingsStore()
    const notificationStore = useNotificationStore()
    const progressStore = useProgressStore()
    const tabsStore = useTabsStore()

    const groups = ref<Group[]>([])
    const loadingGroups = ref<boolean>(false)
    const selectedGroup = ref<Group | null>(null)

    /**
     * @param {string|number} id Group ID or name
     */
    function getGroup(id: number | string): Group | null {
        const group = groups.value.find(group => {
            if (typeof id === 'string') {
                return group.name === id
            }

            return group.id === id
        })

        if (!group) {
            return null
        }

        return group
    }

    async function loadGroupsFromStorage(): Promise<void> {
        loadingGroups.value = true

        const storageGroups = await getGroupsFromStorage()

        groups.value = await hideGroups(storageGroups)
        groups.value.sort((a, b) => b.updatedAt - a.updatedAt)

        loadingGroups.value = false
    }

    async function isIncognito(): Promise<boolean> {
        if (isIncognitoCache !== null) {
            return isIncognitoCache
        }

        const currWindow = await runtime.windows.getCurrent()

        if (currWindow) {
            isIncognitoCache = currWindow.incognito
            return currWindow.incognito
        }

        return false
    }

    async function lock(
        group: Group,
        pass: string,
        confirm?: string,
    ): Promise<Group | null> {
        if (group.isEncrypted) {
            showToast({
                text: trans('group_already_locked'),
                type: 'error',
            })
            return null
        }

        if (pass === '') {
            showToast({
                text: trans('pass_empty'),
                type: 'error',
            })
            return null
        }

        if (confirm && pass !== confirm) {
            showToast({
                text: trans('passwords_not_match'),
                type: 'error',
            })
            return null
        }

        try {
            const encrypted = await cryptoStore.encryptGroup(group, pass)

            encrypted.isEncrypted = true
            encrypted.isPrivate = true

            return encrypted
        } catch (err) {
            showToast({ text: trans('error_occurred'), type: 'error' })
            console.error(err)
        }

        return null
    }

    async function unlock(
        group: Group,
        password: string,
        openTabs: boolean = false,
    ): Promise<boolean> {
        try {
            const decryptedGroup = await cryptoStore.decryptGroup(group, password)
            await save(decryptedGroup)
        } catch (err: any) {
            showToast({
                text: getDecryptionError(err),
                type: 'error',
                duration: 5000,
            })
            return false
        }

        if (settingsStore.settings.rememberPasswordAfterUnlock) {
            await savePasswordToStorage(group.id, password)
        }

        if (openTabs) {
            await tabsStore.openTabs(group, password)
            return true
        }

        showToast({ text: trans('group_unlocked') })

        return true
    }

    // Add groups to memory and save them to storage
    async function addAndSaveGroups(
        groups: Group[],
        replace: boolean,
    ): Promise<void> {
        progressStore.start(groups.length)

        for (const group of groups) {
            group.id = generateGroupId()

            if (replace) {
                await replaceGroup(group)
            }

            await save(group, false)

            progressStore.advance()
        }

        await loadGroupsFromStorage()

        progressStore.finish()
    }

    async function replaceGroup(group: Group): Promise<void> {
        const existing = getGroup(group.name)

        if (existing) {
            await deleteGroup(existing.id)
        }
    }

    async function update(id: number, updates: Partial<Group>): Promise<void> {
        const group = getGroup(id)

        if (!group) {
            groupNotFoundLog(id, 'update')
            return
        }

        Object.assign(group, updates)

        await save(group)
    }

    async function deleteGroup(id: number): Promise<void> {
        groups.value = groups.value.filter(g => g.id !== id)
        await deleteGroupFromStorage(id)
        await notificationStore.recalculateNotification()
    }

    async function deleteAllGroups(): Promise<void> {
        groups.value = []
        await deleteAllGroupsFromStorage()
        await notificationStore.recalculateNotification()
    }

    async function deleteLinkFrom(id: number, linkId: number): Promise<void> {
        const group = getGroup(id)

        if (!group) {
            groupNotFoundLog(id, 'deleteLinkFrom')
            return
        }

        group.links = group.links.filter(link => link.id !== linkId)

        await save(group)
    }

    async function insertLinksInto(id: number, links: Link[]): Promise<void> {
        const group = getGroup(id)

        if (!group) {
            groupNotFoundLog(id, 'insertLinksInto')
            return
        }

        group.links.push(...links)

        await save(group)
    }

    async function save(group: Group, updateTimestamp = true): Promise<void> {
        if (updateTimestamp) {
            group.updatedAt = Date.now()
        }

        await saveGroupToStorage(group)
        await loadGroupsFromStorage()

        await notificationStore.recalculateNotification()
    }

    async function shouldHideGroup(group: Group): Promise<boolean> {
        const isPrivate = await isIncognito()

        if (group.bindURL) {
            const currHashedURL = await getHashedCurrentURL()

            if (currHashedURL !== group.bindURL) {
                return true
            }
        }

        const showOnlyPrivateGroupsInIncognito =
            settingsStore.settings.showOnlyPrivateGroupsInIncognito

        if (!group.isPrivate && isPrivate && showOnlyPrivateGroupsInIncognito) {
            return true
        }

        const showPrivateGroupsOnlyInIncognito =
            settingsStore.settings.showPrivateGroupsOnlyInIncognito

        if (group.isPrivate && !isPrivate && showPrivateGroupsOnlyInIncognito) {
            return true
        }

        return false
    }

    async function hideGroups(storageGroups: Group[]): Promise<Group[]> {
        const result: Group[] = []

        for (const group of storageGroups) {
            const hide = await shouldHideGroup(group)

            if (hide) {
                group.hide = true
            } else {
                delete group.hide
            }

            result.push(group)
        }

        return result
    }

    function groupNotFoundLog(id: number, operation: string): void {
        console.info(`Group "${id}" not found for "${operation}" operation`)
    }

    return {
        groups,
        selectedGroup,
        loadingGroups,
        save,
        update,
        deleteGroup,
        deleteLinkFrom,
        insertLinksInto,
        lock,
        unlock,
        getGroup,
        deleteAllGroups,
        loadGroupsFromStorage,
        addAndSaveGroups,
    }
})
