import type { Group, Link, GroupOperationResult } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { trans, logger } from '@common/modules'
import { runtime } from '@common/modules/runtime'
import { useSettingsStore } from '@/stores/settings'
import { useNotificationStore } from '@/stores/notification'
import { useCryptoStore } from '@/stores/crypto'
import { useProgressStore } from '@/stores/progress'
import { forceUniqueName, isGroupHidden } from '@common/modules/group'
import { getDecryptionError } from '@/errors'
import { getHashedCurrentUrl } from '@common/modules/url'
import { validatePassword } from '@common/modules/validation/group'
import { passwordStorage } from '@common/modules/storage/password'
import { groupStorage } from '@common/modules/storage/group'
import { cloneDeep } from 'lodash'
import { config } from '@common/config'

let isIncognitoCache: boolean | null = null

export const useGroupStore = defineStore('group', () => {
    const cryptoStore = useCryptoStore()
    const settingsStore = useSettingsStore()
    const notificationStore = useNotificationStore()
    const progressStore = useProgressStore()

    const allGroups = ref<readonly Readonly<Group>[]>([])
    const rootGroups = ref<Group[]>([])
    const loading = ref<boolean>(false)
    const selectedGroup = ref<Group | null>(null)

    function get(id: number): Group | null {
        const group = allGroups.value.find(g => g.id === id)

        if (!group) {
            return null
        }

        return cloneDeep(group)
    }

    function getNamed(name: string): Group | null {
        const group = allGroups.value.find(g => g.name === name)

        if (!group) {
            return null
        }

        return cloneDeep(group)
    }

    function exist(id: number): boolean {
        return allGroups.value.some(g => g.id === id)
    }

    async function load(): Promise<void> {
        loading.value = true

        const storageGroups = await groupStorage.getAll()

        rootGroups.value = await hideGroups(storageGroups)
        rootGroups.value.sort((a, b) => b.updatedAt - a.updatedAt)

        allGroups.value = cloneDeep(storageGroups)

        loading.value = false
    }

    function folderGroups(folderId: number): Group[] {
        return allGroups.value.filter(g => g.folderId === folderId)
    }

    async function lock(
        group: Group,
        pass: string,
        confirm?: string,
    ): Promise<GroupOperationResult> {
        if (group.isEncrypted) {
            return failure(trans('group_already_locked'))
        }

        const validationError = validatePassword(pass, confirm)

        if (validationError) {
            return failure(validationError)
        }

        try {
            const encrypted = await cryptoStore.encryptGroup(group, pass)

            encrypted.isEncrypted = true
            encrypted.isPrivate = true

            await update(encrypted)

            return success(encrypted, trans('group_locked'))
        } catch (err) {
            logger().error('Encryption:', err)
        }

        return failure(trans('error_occurred'))
    }

    async function unlock(
        group: Group,
        password: string,
    ): Promise<GroupOperationResult> {
        try {
            const decryptedGroup = await cryptoStore.decryptGroup(group, password)
            await update(decryptedGroup)

            if (settingsStore.settings.rememberPasswordAfterUnlock) {
                await passwordStorage.save(group.id, password)
            }

            return success(decryptedGroup, trans('group_unlocked'))
        } catch (err: any) {
            return failure(getDecryptionError(err))
        }
    }

    function failure(message: string): GroupOperationResult {
        return { failed: true, group: null, message }
    }

    function success(group: Group, message: string): GroupOperationResult {
        return { failed: false, group, message }
    }

    async function removeBindUrl(
        name: string,
        pass: string,
    ): Promise<GroupOperationResult> {
        const group = getNamed(name)

        if (!group) {
            return failure(trans('group_with_credentials_not_found'))
        }

        try {
            // Decrypting also proves the password is correct
            const decrypted = group.isEncrypted
                ? await cryptoStore.decryptGroup(group, pass)
                : group

            const { bindUrl, ...withoutBindUrl } = decrypted
            const encrypted = await cryptoStore.encryptGroup(withoutBindUrl, pass)

            await update(encrypted)

            return success(encrypted, trans('bind_url_removed'))
        } catch (err) {
            logger().error('Remove bind URL:', err)

            // A wrong password is reported the same as a missing group
            return failure(trans('group_with_credentials_not_found'))
        }
    }

    // Add groups to memory and save them to storage
    async function createMany(groups: Group[]): Promise<void> {
        progressStore.start(groups.length)

        for (const group of groups) {
            await create(group, false)
            progressStore.advance()
        }

        await load()
        await notificationStore.recalculateNotification()

        progressStore.finish()
    }

    async function importMany(
        groups: Group[],
        shouldReplaceDuplicates = false,
    ): Promise<void> {
        progressStore.start(groups.length)

        const storedIds = new Set((await groupStorage.getAll()).map(g => g.id))

        for (const group of groups) {
            const hasDuplicate = storedIds.has(group.id)

            if (!hasDuplicate) {
                storedIds.add(group.id)
                await create(group)
                progressStore.advance()
                continue
            }

            if (shouldReplaceDuplicates) {
                await replace(group)
            }

            progressStore.advance()
        }

        await load()

        progressStore.finish()
    }

    async function updateFields(
        id: number,
        updates: Partial<Group>,
    ): Promise<boolean> {
        const group = get(id)

        if (!group) {
            groupNotFoundLog(id, 'update')
            return false
        }

        Object.assign(group, updates)

        if (updates.folderId === config.GROUP_MISSING_FOLDER) {
            delete group.folderId
        }

        await update(group)

        return true
    }

    async function updateLink(
        groupId: number,
        linkId: number,
        updates: Partial<Link>,
    ): Promise<boolean> {
        const group = get(groupId)

        if (!group) {
            groupNotFoundLog(groupId, 'updateLink')
            return false
        }

        for (const link of group.links) {
            if (link.id !== linkId) {
                continue
            }

            Object.assign(link, updates)

            return updateFields(groupId, { links: group.links })
        }

        return false
    }

    async function deleteGroup(id: number): Promise<void> {
        rootGroups.value = rootGroups.value.filter(g => g.id !== id)
        allGroups.value = allGroups.value.filter(g => g.id !== id)

        await passwordStorage.delete(id)
        await groupStorage.delete(id)
        await notificationStore.recalculateNotification()
    }

    async function deleteGroupNamed(name: string): Promise<void> {
        const group = getNamed(name)

        if (group) {
            await deleteGroup(group.id)
        }
    }

    async function deleteAll(): Promise<void> {
        rootGroups.value = []
        allGroups.value = []
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

        const deleteIndex = group.links.findIndex(link => link.id === linkId)

        if (deleteIndex !== -1) {
            group.links.splice(deleteIndex, 1)
        }

        await update(group)

        return true
    }

    async function insertLinksInto(id: number, links: Link[]): Promise<boolean> {
        const group = get(id)

        if (!group) {
            groupNotFoundLog(id, 'insertLinksInto')
            return false
        }

        group.links.push(...links)

        await update(group)

        return true
    }

    async function create(group: Group, loadGroups = true): Promise<void> {
        if (loading.value) {
            const msg = `Cannot create group ${group.name}. The loading is still active`
            logger().info(msg)
            return
        }

        loading.value = true

        try {
            if (settingsStore.settings.overrideWithSameName) {
                await deleteGroupNamed(group.name)
            }

            // Must run after the delete above,
            // otherwise the old name still counts as taken
            const name = uniqueGroupName(group.name)

            await groupStorage.save({ ...group, name })

            if (loadGroups) {
                await reloadGroupsAndNotifications()
            }
        } finally {
            loading.value = false
        }
    }

    function uniqueGroupName(name: string): string {
        const takenNames = new Set(allGroups.value.map(group => group.name))
        return forceUniqueName(name, takenNames)
    }

    async function reloadGroupsAndNotifications(): Promise<void> {
        await load()
        await notificationStore.recalculateNotification()
    }

    async function update(group: Group): Promise<void> {
        group.updatedAt = Date.now()

        const takenNames = new Set(
            allGroups.value.filter(g => g.id !== group.id).map(g => g.name),
        )

        group.name = forceUniqueName(group.name, takenNames)

        await groupStorage.save(group)
        await reloadGroupsAndNotifications()
    }

    async function isGroupHiddenInCurrentWindow(group: Group): Promise<boolean> {
        const isIncognito = await isIncognitoWindow()

        let currHashedUrl: string | null = null

        if (group.bindUrl) {
            currHashedUrl = await getHashedCurrentUrl()
        }

        return isGroupHidden(group, {
            isIncognito,
            currHashedUrl,
            settings: settingsStore.settings,
        })
    }

    async function hideGroups(storageGroups: Group[]): Promise<Group[]> {
        for (const group of storageGroups) {
            if (await isGroupHiddenInCurrentWindow(group)) {
                group.hide = true
                continue
            }
            delete group.hide
        }

        return storageGroups.filter(group => !group.folderId)
    }

    async function isIncognitoWindow(): Promise<boolean> {
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

    async function replace(group: Group): Promise<void> {
        const existing = get(group.id)

        if (existing) {
            await updateFields(group.id, group)
        }
    }

    function groupNotFoundLog(id: number, operation: string): void {
        logger().info(`Group "${id}" not found for "${operation}" operation`)
    }

    return {
        allGroups,
        selectedGroup,
        rootGroups,
        loading,
        get,
        getNamed,
        create,
        update,
        lock,
        load,
        exist,
        updateFields,
        unlock,
        removeBindUrl,
        createMany,
        importMany,
        deleteAll,
        updateLink,
        deleteGroup,
        deleteGroupNamed,
        folderGroups,
        deleteLinkFrom,
        insertLinksInto,
        isGroupHiddenInCurrentWindow,
        hideGroups,
    }
})
