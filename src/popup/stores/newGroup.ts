import type { Group, UserChoices, Link } from '@/types'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getDefaultGroupName } from '@/modules/getDefaultGroupName'
import { generateGroupId } from '@common/modules/generateGroupId'
import { trans } from '@common/modules/trans'

export const GROUP_NAME_MAX_LENTH = 45

export const useNewGroupStore = defineStore('newGroup', () => {
    // null suggest that there was no choice yet
    const choices = ref<UserChoices>({
        isPrivate: null,
        name: null,
        selectedLinks: null,
        closeTabs: null,
        password: null,
        confirmPassword: null,
        wantsSelectAllLinks: null,
    })

    const passwordErr = computed<string>(() => {
        const pass = choices.value.password || ''
        const confirm = choices.value.confirmPassword || ''
        const hasErr = confirm.length > 0 && pass !== confirm

        return hasErr ? trans('passwords_not_match') : ''
    })

    const nameLength = computed<number>(() => {
        choices.value.name ??= ''
        return choices.value.name.length
    })

    const preventPasswordSubmit = computed<boolean>(() => {
        if (!choices.value.isPrivate) {
            return nameLength.value === 0
        }

        const pass = choices.value.password
        const confirm = choices.value.confirmPassword

        return (!!passwordErr.value || !pass || !confirm)
    })

    function createGroupFromChoices(): Group {
        const isPrivate = choices.value.isPrivate || false

        return {
            id: generateGroupId(),
            name: choices.value.name || getDefaultGroupName(isPrivate),
            isPrivate,
            isEncrypted: false,
            updatedAt: Date.now(),
            createdAt: Date.now(),
            links: choices.value.selectedLinks || [],
        }
    }

    function isNameTooLong(): boolean {
        choices.value.name ??= ''
        return choices.value.name.length > GROUP_NAME_MAX_LENTH
    }

    function isPasswordEmpty(): boolean {
        choices.value.isPrivate ??= false
        return choices.value.isPrivate && !choices.value.password
    }

    function resetChoices(): void {
        for (const key in choices.value) {
            // @ts-ignore
            choices.value[key] = null
        }
    }

    function selectAllLinks(allLinks: Link[]): void {
        choices.value.selectedLinks ??= []
        choices.value.selectedLinks = allLinks
    }

    function deselectAllLinks(): void {
        choices.value.selectedLinks = null
    }

    function toggleSelect(link: Link): void {
        choices.value.selectedLinks ??= []

        const contains = choices.value.selectedLinks.some(l => l.id === link.id)

        // Remove the link ID from selected IDs if contains
        if (contains) {
            choices.value.selectedLinks = choices.value.selectedLinks.filter(l => l.id !== link.id)
            return
        }

        choices.value.selectedLinks.push(link)
    }

    return {
        nameLength,
        choices,
        preventPasswordSubmit,
        passwordErr,
        createGroupFromChoices,
        isNameTooLong,
        isPasswordEmpty,
        toggleSelect,
        resetChoices,
        selectAllLinks,
        deselectAllLinks,
    }
})
