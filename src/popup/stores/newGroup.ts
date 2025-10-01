import type { Group, UserChoices, Link } from '@/types'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getDefaultGroupName } from '@/modules/getDefaultGroupName'
import { generateGroupId } from '@common/modules/generateGroupId'

export const useNewGroupStore = defineStore('newGroup', () => {
    // null suggest that there was no choice yet
    const choices = ref<UserChoices>({
        isPrivate: null,
        name: null,
        closeTabs: null,
        password: null,
        confirmPassword: null,
        wantsSelectAllLinks: null,
        bindURL: null,
    })

    const nameLength = computed<number>(() => {
        choices.value.name ??= ''
        return choices.value.name.length
    })

    function createGroupFromChoices(links: Link[]): Group {
        const group: Group = {
            id: generateGroupId(),
            name: choices.value.name || getDefaultGroupName(),
            isPrivate: choices.value.isPrivate || false,
            isEncrypted: false,
            updatedAt: Date.now(),
            createdAt: Date.now(),
            links,
        }

        if (choices.value.bindURL) {
            group.bindURL = choices.value.bindURL
        }

        return group
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

    return {
        nameLength,
        choices,
        createGroupFromChoices,
        isPasswordEmpty,
        resetChoices,
    }
})
