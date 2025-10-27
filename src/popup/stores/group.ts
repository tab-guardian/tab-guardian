import type { Group, Link } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { trans, logger } from '@common/modules'
import { generateGroupId } from '@common/modules/group'
import { runtime } from '@common/modules/runtime'
import { useSettingsStore } from '@/stores/settings'
import { useNotificationStore } from '@/stores/notification'
import { useCryptoStore } from '@/stores/crypto'
import { useProgressStore } from '@/stores/progress'
import { useTabsStore } from '@/stores/tabs'
import { getDecryptionError } from '@/errors'
import { getHashedCurrentUrl } from '@common/modules/url'
import { validatePassword } from '@common/modules/validation/group'
import { passwordStorage } from '@common/modules/storage/password'
import { groupStorage } from '@common/modules/storage/group'

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
    function get(id: number | string): Group | null {
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

    function exist(id: number): boolean {
        return groups.value.some(g => g.id === id)
    }

    async function loadGroupsFromStorage(): Promise<void> {
        loadingGroups.value = true

        const storageGroups = await groupStorage.getAll()

        groups.value = await hideGroups(storageGroups)
        groups.value.sort((a, b) => b.updatedAt - a.updatedAt)

        loadingGroups.value = false
    }

    type LockFuncReturnValue =
        | { message: string; failed: true; group: null }
        | { message: string; failed: false; group: Group }

    async function lock(
        group: Group,
        pass: string,
        confirm?: string,
    ): Promise<LockFuncReturnValue> {
        if (group.isEncrypted) {
            return {
                message: trans('group_already_locked'),
                failed: true,
                group: null,
            }
        }

        const validationError = validatePassword(pass, confirm)

        if (validationError) {
            return {
                message: validationError,
                failed: true,
                group: null,
            }
        }

        try {
            const encrypted = await cryptoStore.encryptGroup(group, pass)

            encrypted.isEncrypted = true
            encrypted.isPrivate = true

            await save(encrypted)

            return {
                failed: false,
                message: trans('group_locked'),
                group: encrypted,
            }
        } catch (err) {
            logger().error('Encryption:', err)
        }

        return {
            failed: true,
            group: null,
            message: trans('error_occurred'),
        }
    }

    type UnlockFuncReturnValue =
        | { message: string; failed: true; group: null }
        | { message: string; failed: false; group: Group }

    async function unlock(
        group: Group,
        password: string,
        openTabs: boolean = false,
    ): Promise<UnlockFuncReturnValue> {
        try {
            const decryptedGroup = await cryptoStore.decryptGroup(group, password)
            await save(decryptedGroup)

            if (settingsStore.settings.rememberPasswordAfterUnlock) {
                await passwordStorage.save(group.id, password)
            }

            if (openTabs) {
                await tabsStore.openTabs(group, password)
            }

            return {
                failed: false,
                message: trans('group_unlocked'),
                group: decryptedGroup,
            }
        } catch (err: any) {
            return {
                message: getDecryptionError(err),
                failed: true,
                group: null,
            }
        }
    }

    // Add groups to memory and save them to storage
    async function saveMany(
        groups: Group[],
        replace: boolean = false,
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

    async function update(id: number, updates: Partial<Group>): Promise<boolean> {
        const group = get(id)

        if (!group) {
            groupNotFoundLog(id, 'update')
            return false
        }

        Object.assign(group, updates)

        await save(group)

        return true
    }

    async function deleteGroup(id: number): Promise<void> {
        groups.value = groups.value.filter(g => g.id !== id)
        await groupStorage.delete(id)
        await notificationStore.recalculateNotification()
    }

    async function deleteAll(): Promise<void> {
        groups.value = []
        await groupStorage.deleteAll()
        await notificationStore.recalculateNotification()
    }

    async function deleteLinkFrom(id: number, linkId: number): Promise<boolean> {
        const group = get(id)

        if (!group) {
            groupNotFoundLog(id, 'deleteLinkFrom')
            return false
        }

        const linkExist = group.links.some(link => link.id === linkId)

        if (!linkExist) {
            return false
        }

        group.links = group.links.filter(link => link.id !== linkId)

        await save(group)

        return true
    }

    async function insertLinksInto(id: number, links: Link[]): Promise<boolean> {
        const group = get(id)

        if (!group) {
            groupNotFoundLog(id, 'insertLinksInto')
            return false
        }

        group.links.push(...links)

        await save(group)

        return true
    }

    async function save(group: Group, updateTimestamp = true): Promise<void> {
        if (updateTimestamp) {
            group.updatedAt = Date.now()
        }

        await groupStorage.save(group)
        await loadGroupsFromStorage()

        await notificationStore.recalculateNotification()
    }

    // Private function
    async function shouldHideGroup(group: Group): Promise<boolean> {
        const isPrivate = await isIncognito()

        if (group.bindUrl) {
            const currHashedUrl = await getHashedCurrentUrl()

            if (currHashedUrl !== group.bindUrl) {
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

    // Private function
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

    // Private function
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

    // Private function
    async function replaceGroup(group: Group): Promise<void> {
        const existing = get(group.name)

        if (existing) {
            await deleteGroup(existing.id)
        }
    }

    // Private function
    function groupNotFoundLog(id: number, operation: string): void {
        logger().info(`Group "${id}" not found for "${operation}" operation`)
    }

    return {
        selectedGroup,
        loadingGroups,
        groups,
        get,
        save,
        lock,
        exist,
        update,
        unlock,
        saveMany,
        deleteAll,
        deleteGroup,
        deleteLinkFrom,
        insertLinksInto,
        loadGroupsFromStorage,
    }
})
