import type { Group, Link } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { trans, generateGroupId } from '@common/modules/utils'
import { runtime } from '@common/modules/runtime'
import { useSettingsStore } from '@/stores/settings'
import { useNotificationStore } from '@/stores/notification'
import { useCryptoStore } from '@/stores/crypto'
import { showToast } from '@common/modules/toast'
import { getCurrentURL } from '@common/modules/utils/getCurrentURL'
import { savePasswordToStorage } from '@common/modules/storage/password'
import {
    deleteAllGroupsFromStorage,
    deleteGroupFromStorage,
    getGroupsFromStorage,
    saveGroupToStorage,
} from '@common/modules/storage/group'

export const useGroupStore = defineStore('group', () => {
    const cryptoStore = useCryptoStore()
    const settingsStore = useSettingsStore()
    const notificationStore = useNotificationStore()

    const groups = ref<Group[]>([])
    const loadingGroups = ref<boolean>(false)
    const selectedGroup = ref<Group | null>(null)

    function getGroupById(groupId: number | undefined): Group | null {
        if (!groupId) {
            console.warn('No group id provided when trying to get group by id')
            return null
        }

        const group = groups.value.find(group => group.id === groupId)

        if (!group) {
            console.warn(`Group with id ${groupId} not found`)
            return null
        }

        return group
    }

    function getGroupByName(name: string): Group | null {
        const group = groups.value.find(group => group.name === name)

        if (!group) {
            console.error(`Group with name ${name} not found`)
            return null
        }

        return group
    }

    async function updatePassword(pass: string): Promise<void> {
        if (!selectedGroup.value) {
            console.error('No group selected to update password')
            showToast(trans('error_occurred'), 'error')
            return
        }

        await savePasswordToStorage(selectedGroup.value.id, pass)
    }

    async function loadGroupsFromStorage(): Promise<void> {
        loadingGroups.value = true

        const storageGroups = await getGroupsFromStorage()

        displayGroups(storageGroups)
    }

    async function filterGroups(storageGroups: Group[]): Promise<Group[]> {
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

    async function isIncognito(): Promise<boolean> {
        const currWindow = await runtime.windows.getCurrent()
        return currWindow ? currWindow.incognito : false
    }

    async function shouldHideGroup(group: Group): Promise<boolean> {
        const isPrivate = await isIncognito()

        if (group.bindURL) {
            const hashedURL = await getCurrentURL(true)

            if (hashedURL !== group.bindURL) {
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

    async function encrypt(group: Group, pass: string, confirm?: string): Promise<Group | null> {
        if (group.isEncrypted) {
            showToast(trans('group_already_locked'), 'error')
            return null
        }

        if (pass === '') {
            showToast(trans('pass_empty'), 'error')
            return null
        }

        if (confirm && pass !== confirm) {
            showToast(trans('passwords_not_match'), 'error')
            return null
        }

        try {
            const encrypted = await cryptoStore.encryptGroup(group, pass)

            encrypted.isEncrypted = true
            encrypted.isPrivate = true

            return encrypted
        } catch (err) {
            showToast(trans('error_occurred'), 'error')
            console.error(err)
        }

        return null
    }

    // Add groups to memory and save them to storage
    async function addAndSaveGroups(groups: Group[], replace: boolean): Promise<void> {
        for (const group of groups) {
            group.id = generateGroupId()

            if (replace) {
                const existingGroup = getGroupByName(group.name)

                if (existingGroup) {
                    await deleteGroup(existingGroup.id)
                }
            }

            await save(group, false)
        }

        await loadGroupsFromStorage()
    }

    async function setIcon(groupId: number, icon: string): Promise<void> {
        const group = getGroupById(groupId)

        if (!group) {
            return
        }

        group.icon = icon

        await save(group)
    }

    async function deleteGroup(groupId: number): Promise<void> {
        groups.value = groups.value.filter(g => g.id !== groupId)
        await deleteGroupFromStorage(groupId)
        await notificationStore.recalculateNotification()
    }

    async function deleteAllGroups(): Promise<void> {
        groups.value = []
        await deleteAllGroupsFromStorage()
        await notificationStore.recalculateNotification()
    }

    async function deleteAllLinks(groupId: number): Promise<void> {
        const group = getGroupById(groupId)

        if (!group) {
            return
        }

        group.links = []

        await save(group)
    }

    async function incrementOpenedTimes(group: Group): Promise<void> {
        if (group.openedTimes) {
            group.openedTimes++
        } else {
            group.openedTimes = 1
        }

        groups.value = groups.value.map(g => {
            if (g.id === group.id) {
                g.openedTimes = group.openedTimes
            }

            return g
        })

        await save(group)
    }

    async function deleteLinkFrom(groupId: number, linkId: number): Promise<void> {
        const group = getGroupById(groupId)

        if (!group) {
            return
        }

        group.links = group.links.filter(link => link.id !== linkId)

        await save(group)
    }

    async function saveLinksTo(groupId: number, links: Link[]): Promise<void> {
        const group = getGroupById(groupId)

        if (!group) {
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

        const updatedGroups = groups.value.map(g => (g.id === group.id ? group : g))

        displayGroups(updatedGroups)
    }

    async function displayGroups(groupsToDisplay: Group[]): Promise<void> {
        groups.value = await filterGroups(groupsToDisplay)
        groups.value.sort((a, b) => b.updatedAt - a.updatedAt)
        loadingGroups.value = false
    }

    return {
        groups,
        selectedGroup,
        loadingGroups,
        save,
        deleteGroup,
        deleteLinkFrom,
        saveLinksTo,
        encrypt,
        getGroupById,
        deleteAllLinks,
        deleteAllGroups,
        incrementOpenedTimes,
        loadGroupsFromStorage,
        setIcon,
        updatePassword,
        addAndSaveGroups,
    }
})
