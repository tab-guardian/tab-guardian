import type { Group, UserChoices } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDefaultGroupName } from '@/modules/getDefaultGroupName'
import { generateGroupId } from '@common/modules/generateGroupId'

const GROUP_NAME_MAX_LENTH = 45

export const useNewGroupStore = defineStore('newGroup', () => {
    // null suggest that there was no choice yet
    const choices = ref<UserChoices>({
        isPrivate: null,
        name: null,
        links: null,
        closeTabs: null,
        password: null,
        confirmPassword: null,
        selectedTabsIds: null,
    })

    const targetGroupId = ref<number | null>(null)

    function createGroupFromChoices(): Group {
        const isPrivate = choices.value.isPrivate || false

        return {
            id: generateGroupId(),
            name: choices.value.name || getDefaultGroupName(isPrivate),
            isPrivate: isPrivate,
            isEncrypted: false,
            updatedAt: Date.now(),
            createdAt: Date.now(),
            links: choices.value.links || [],
        }
    }

    function resetChoices(): void {
        for (const key in choices.value) {
            // @ts-ignore
            choices.value[key] = null
        }
    }

    function selectAll(): void {
        if (!choices.value.selectedTabsIds) {
            choices.value.selectedTabsIds = []
        }

        if (!choices.value.links) {
            choices.value.links = []
        }

        choices.value.selectedTabsIds = choices.value.links.map(l => l.id)
    }

    function deselectAll(): void {
        if (!choices.value.selectedTabsIds) {
            choices.value.selectedTabsIds = []
        }

        choices.value.selectedTabsIds = null
    }

    function toggleSelect(tabId: number): void {
        if (!choices.value.selectedTabsIds) {
            choices.value.selectedTabsIds = []
        }

        const contains = choices.value.selectedTabsIds.includes(tabId)

        if (contains) {
            choices.value.selectedTabsIds.push(tabId)
            return
        }

        // Remove the tab ID from selected IDs
        choices.value.selectedTabsIds = choices.value.selectedTabsIds.filter(id => id !== tabId)
    }

    return {
        choices,
        targetGroupId,
        toggleSelect,
        selectAll,
        deselectAll,
    }
})
