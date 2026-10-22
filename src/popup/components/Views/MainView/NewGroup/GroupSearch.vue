<script setup lang="ts">
import type { Group } from '@common/types'
import { useGroupStore } from '@/stores/group'
import { useFolderStore } from '@/stores/folder'
import { useOpenGroup } from '@/composables/useOpenGroup'
import { ref, onMounted, onUnmounted } from 'vue'
import { logger, trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import MagnifyingGlassIcon from '@common/components/Icons/MagnifyingGlassIcon.vue'

const groupStore = useGroupStore()
const folderStore = useFolderStore()
const { open } = useOpenGroup()

const placeholder =
    navigator.userAgent.indexOf('Mac OS X') != -1 ? '⌃⌘k' : 'ctrl+alt+k'

const inpElem = ref<HTMLInputElement | null>(null)
const query = ref<string>('')

onMounted(() => {
    document.addEventListener('keydown', focusOnSearch)
    document.addEventListener('keydown', openFirstGroup)
})

onUnmounted(() => {
    document.removeEventListener('keydown', focusOnSearch)
    document.removeEventListener('keydown', openFirstGroup)
})

async function openFirstGroup(e: KeyboardEvent): Promise<void> {
    const noGroups = groupStore.rootGroups.length === 0
    const inpIsFocused = inpElem.value === document.activeElement

    if (e.key !== 'Enter' || noGroups || query.value === '' || !inpIsFocused) {
        return
    }

    const group = groupStore.rootGroups[0]

    // Clear the search after Enter so the full list comes back
    await resetSearch()

    const toastMsgs = await open(group)

    for (const toastMsg of toastMsgs) {
        showToast(toastMsg)
    }
}

function focusOnSearch(e: KeyboardEvent): void {
    if (!inpElem.value) {
        logger().warn('Input element is not defined')
        return
    }

    if (e.key === 'Escape') {
        inpElem.value.blur()
    }

    // 🍏 Mac (cmd + control + k)
    if (e.key === 'k' && e.ctrlKey && e.metaKey) {
        inpElem.value.focus()
    }

    // 🐧 Linux / 🪟 Windows (ctrl + alt + k)
    if (e.key === 'k' && e.altKey && e.ctrlKey) {
        inpElem.value.focus()
    }
}

async function filterGroups(): Promise<void> {
    if (!inpElem.value) {
        logger().warn('Input element is not defined')
        return
    }

    query.value = inpElem.value.value

    if (query.value === '') {
        await resetSearch()
        return
    }

    folderStore.folders = []

    groupStore.rootGroups = groupStore.allGroups.filter(group =>
        matchesSearchQuery(group, query.value),
    )
}

function matchesSearchQuery(group: Group, query: string): boolean {
    // Hidden groups are not visible, so they should not be searchable either
    if (group.hide) {
        return false
    }

    const normalizedQuery = query.toLowerCase()

    if (group.name.toLowerCase().includes(normalizedQuery)) {
        return true
    }

    // Encrypted links hold ciphertext in their titles,
    // so matching them would give random results
    if (group.isEncrypted) {
        return false
    }

    return group.links.some(link =>
        link.title.toLowerCase().includes(normalizedQuery),
    )
}

async function resetSearch(): Promise<void> {
    query.value = ''
    inpElem.value!.value = ''
    await groupStore.load()
    await folderStore.load()
}

function clearInput(): void {
    if (query.value !== '') {
        return
    }

    query.value = ''
}
</script>

<template>
    <div class="flex items-center gap-2 mt-2 relative">
        <MagnifyingGlassIcon class="size-5" />

        <input
            ref="inpElem"
            type="text"
            :class="[
                'w-full py-1 px-2 border border-border rounded-lg text-sm',
                'ring-0 focus:ring-2 ring-border focus:outline-hidden bg-transparent',
            ]"
            :placeholder="trans('enter_group_name')"
            @input="filterGroups"
            @blur="clearInput"
        />

        <div
            :class="[
                'absolute right-1 text-xs font-mono bg-gray-600/10',
                'dark:bg-gray-600/50 px-2 py-0.5 rounded-md tracking-widest opacity-80',
            ]"
        >
            {{ placeholder }}
        </div>
    </div>
</template>
