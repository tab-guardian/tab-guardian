import type { Group, UserChoices, Link } from '@common/types'
import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { getDefaultGroupName } from '@common/modules/group'
import { generateGroupId } from '@common/modules'

export const useNewGroupStore = defineStore('newGroup', () => {
    // null suggest that there was no choice yet
    const choices = reactive<UserChoices>({
        isPrivate: null,
        name: null,
        closeTabs: null,
        password: null,
        confirmPassword: null,
        wantsSelectAllLinks: null,
        bindUrl: null,
    })

    const nameLength = computed<number>(() => {
        choices.name ??= ''
        return choices.name.length
    })

    function createGroupFromChoices(links: Link[]): Group {
        const group: Group = {
            id: generateGroupId(),
            name: choices.name || getDefaultGroupName(),
            isPrivate: choices.isPrivate || false,
            isEncrypted: false,
            updatedAt: Date.now(),
            createdAt: Date.now(),
            links,
        }

        if (choices.bindUrl) {
            group.bindUrl = choices.bindUrl
        }

        return group
    }

    function isPasswordEmpty(): boolean {
        choices.isPrivate ??= false
        return choices.isPrivate && !choices.password
    }

    function resetChoices(): void {
        for (const key in choices) {
            // @ts-ignore
            choices[key] = null
        }
    }

    return {
        choices,
        nameLength,
        createGroupFromChoices,
        isPasswordEmpty,
        resetChoices,
    }
})
