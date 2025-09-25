import type { Group, Link, NewGroup } from '@/types'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { trans } from '@common/modules/trans'
import { useSettingsStore } from '@/stores/settings'
import { usePopupStore } from '@/stores/popup'
import { useCryptoStore } from '@/stores/crypto'
import { showToast } from '@common/modules/showToast'
import { error } from '@common/modules/error'
import { isDevelopment } from '@common/modules/isDevelopment'
import { isIncognito } from '@common/modules/browser/windows'
import { getDefaultGroupName } from '@/modules/getDefaultGroupName'
import { closeTabsByIds } from '@/modules/tabs/closeTabsByIds'
import { getCurrentURL } from '@/modules/getCurrentURL'
import { generateGroupId } from '@common/modules/generateGroupId'
import { savePasswordToStorage } from '@common/modules/storage/password'
import {
    deleteAllGroupsFromStorage,
    deleteGroupFromStorage,
    getGroupsFromStorage,
    saveGroupToStorage,
} from '@common/modules/storage/group'

export const useGroupStore = defineStore('group', () => {
    const popupStore = usePopupStore()
    const cryptoStore = useCryptoStore()

    const groupNameMaxLength = 45
    const groupNameLength = computed<number>(() => {
        return newGroup.value.name.length
    })

    const groups = ref<Group[]>([])
    const isSaving = ref<boolean>(false)
    const selectedGroup = ref<Group | null>(null)
    const isTitleFieldActive = ref<boolean>(false)
    const closeSelectedTabs = ref<boolean>(false)

    const settingsStore = useSettingsStore()

    const newGroup = ref<NewGroup>({
        name: '',
        isPrivate: false,
        password: '',
        confirmPassword: '',
        bindURL: null,
    })

    function getGroupById(groupId: number | undefined): Group | null {
        if (!groupId) {
            error.warn('No group id provided when trying to get group by id')
            return null
        }

        const group = groups.value.find(group => group.id === groupId)

        if (!group) {
            error.err(`Group with id ${groupId} not found`)
            return null
        }

        return group
    }

    function getGroupByName(name: string): Group | null {
        const group = groups.value.find(group => group.name === name)

        if (!group) {
            error.err(`Group with name ${name} not found`)
            return null
        }

        return group
    }

    async function updatePassword(pass: string): Promise<void> {
        if (!selectedGroup.value) {
            error.err('No group selected to update password')
            showToast(trans('error_occurred'), 'error')
            return
        }

        savePasswordToStorage(selectedGroup.value.id, pass)
    }

    async function loadGroupsFromStorage(): Promise<void> {
        const storageGroups = await getGroupsFromStorage()

        if (isDevelopment()) {
            groups.value = storageGroups
            groups.value.sort((a, b) => b.updatedAt - a.updatedAt)
            return
        }

        groups.value = await filterGroups(storageGroups)
        groups.value.sort((a, b) => b.updatedAt - a.updatedAt)
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

    // Doesn't save the group to storage
    async function encryptGroupById(
        groupId: number,
        pass: string,
        confirmPass?: string,
    ): Promise<Group | null> {
        const group = getGroupById(groupId)

        if (!group) {
            showToast(trans('group_not_found'), 'error')
            return null
        }

        if (group.isEncrypted) {
            showToast(trans('group_already_locked'), 'error')
            return null
        }

        if (pass === '') {
            showToast(trans('pass_empty'), 'error')
            return null
        }

        if (confirmPass && pass !== confirmPass) {
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
            error.err(err)
        }

        return null
    }

    async function createEmptyGroup(): Promise<Group> {
        const group: Group = {
            id: generateGroupId(),
            name:
                newGroup.value.name || getDefaultGroupName(newGroup.value.isPrivate),
            isPrivate: newGroup.value.isPrivate,
            isEncrypted: false,
            updatedAt: Date.now(),
            createdAt: Date.now(),
            openedTimes: 0,
            links: [],
        }

        if (newGroup.value.bindURL) {
            group.bindURL = newGroup.value.bindURL
        }

        await prependGroup(group)

        return group
    }

    async function prependGroup(group: Group): Promise<void> {
        if (settingsStore.settings.overrideWithSameName) {
            const sameNameGroup = groups.value.find(g => g.name === group.name)

            if (sameNameGroup) {
                await deleteGroup(sameNameGroup.id)
            }
        }

        groups.value.unshift(group)
    }

    async function addGroups(groups: Group[], replace: boolean): Promise<void> {
        for (const group of groups) {
            group.id = generateGroupId()

            if (replace) {
                const existingGroup = getGroupByName(group.name)

                if (existingGroup) {
                    await deleteGroup(existingGroup.id)
                }
            }

            await saveGroup(group)
        }

        await loadGroupsFromStorage()
    }

    async function setIcon(groupId: number, icon: string): Promise<void> {
        const group = getGroupById(groupId)

        if (!group) {
            return
        }

        group.icon = icon

        await saveGroup(group)
    }

    function startGroupRenaming(): void {
        if (!selectedGroup.value) {
            error.err('No group selected to rename')
            showToast(trans('error_occurred'), 'error')
            return
        }

        isTitleFieldActive.value = true
        selectedGroup.value = selectedGroup.value
        newGroup.value.name = selectedGroup.value.name

        popupStore.closePopup('groupMenuView')
    }

    async function renameGroup(): Promise<void> {
        if (!selectedGroup.value) {
            error.err('No group selected for renaming')
            showToast(trans('error_occurred'), 'error')
            return
        }

        if (groupNameLength.value > groupNameMaxLength) {
            showToast(trans('Group name is too long'), 'error')
            return
        }

        const group = getGroupById(selectedGroup.value.id)

        if (!group) {
            showToast(trans('error_occurred'), 'error')
            return
        }

        if (newGroup.value.name === '') {
            group.name = getDefaultGroupName(newGroup.value.isPrivate)
        } else {
            group.name = newGroup.value.name
        }

        isTitleFieldActive.value = false

        await saveGroup(group)
        showToast(trans('new_name_saved'))
    }

    async function deleteGroup(groupId: number): Promise<void> {
        groups.value = groups.value.filter(g => g.id !== groupId)
        await deleteGroupFromStorage(groupId)
    }

    async function deleteAllGroups(): Promise<void> {
        groups.value = []
        await deleteAllGroupsFromStorage()
    }

    async function deleteAllLinks(groupId: number): Promise<void> {
        const group = getGroupById(groupId)

        if (!group) {
            return
        }

        group.links = []

        await saveGroup(group)
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

        await saveGroup(group)
    }

    async function deleteLink(groupId: number, linkId: number): Promise<void> {
        const group = getGroupById(groupId)

        if (!group) {
            return
        }

        group.links = group.links.filter(link => link.id !== linkId)

        await saveGroup(group)
    }

    async function prependLinksTo(groupId: number | Group, links: Link[]): Promise<void> {
        const group = groupId instanceof Object ? groupId : getGroupById(groupId)

        if (!group) {
            return
        }

        group.links.unshift(...links)

        await saveGroup(group)

        if (closeSelectedTabs.value) {
            await closeTabsByIds(links.map(link => link.id))
        }
    }

    async function decryptGroup(group: Group, pass: string): Promise<void> {
        const unlockedGroup = await cryptoStore.decryptGroup(group, pass)
        await saveGroup(unlockedGroup)
    }

    function resetNewGroup(): void {
        newGroup.value = {
            name: '',
            isPrivate: false,
            password: '',
            confirmPassword: '',
            bindURL: '',
        }
    }

    async function saveGroup(group: Group): Promise<void> {
        group.updatedAt = Date.now()

        await saveGroupToStorage(group)

        groups.value = groups.value.map(g => (g.id === group.id ? group : g))
        groups.value = await filterGroups(groups.value)
        groups.value.sort((a, b) => b.updatedAt - a.updatedAt)

        setTimeout(() => (isSaving.value = false), 500)
    }

    return {
        groups,
        isSaving,
        selectedGroup,
        isTitleFieldActive,
        closeSelectedTabs,
        newGroup,
        groupNameMaxLength,
        groupNameLength,
        saveGroup,
        deleteGroup,
        deleteLink,
        prependLinksTo,
        decryptGroup,
        renameGroup,
        createEmptyGroup,
        encryptGroupById,
        getGroupById,
        deleteAllLinks,
        deleteAllGroups,
        startGroupRenaming,
        incrementOpenedTimes,
        loadGroupsFromStorage,
        resetNewGroup,
        setIcon,
        updatePassword,
        addGroups,
    }
})
