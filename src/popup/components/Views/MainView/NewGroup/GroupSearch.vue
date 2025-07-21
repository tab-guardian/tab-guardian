<script setup lang="ts">
import type { Group } from '@/types'
import { useGroupStore } from '@/stores/group'
import { useTabsStore } from '@/stores/tabs'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { trans } from '@common/modules/trans'
import MagnifyingGlassIcon from '@common/components/Icons/MagnifyingGlassIcon.vue'

const groupStore = useGroupStore()
const tabsStore = useTabsStore()
const router = useRouter()
const initialGroups = ref<Group[]>([])
const inpElem = ref<HTMLInputElement | null>(null)
const query = ref<string>('')
const placeholder =
    navigator.userAgent.indexOf('Mac OS X') != -1 ? '⌘+k' : 'ctrl+alt+k'

onMounted(() => {
    document.addEventListener('keydown', focusOnSearch)
    document.addEventListener('keydown', openFirstGroup)
})

onUnmounted(() => {
    document.removeEventListener('keydown', focusOnSearch)
    document.removeEventListener('keydown', openFirstGroup)

    if (initialGroups.value.length === 0) {
        initialGroups.value = groupStore.groups
    }

    groupStore.groups = initialGroups.value
})

async function openFirstGroup(e: KeyboardEvent): Promise<void> {
    const noGroups = groupStore.groups.length === 0
    const inpIsFocused = inpElem.value === document.activeElement

    if (e.key !== 'Enter' || noGroups || query.value === '' || !inpIsFocused) {
        return
    }

    const group = groupStore.groups[0]

    // Clear the input field after Enter was pressed
    query.value = ''
    inpElem.value!.value = ''
    groupStore.groups = initialGroups.value

    if (!group.isPrivate) {
        await tabsStore.openTabs(group)
        return
    }

    await router.push({
        name: 'group',
        params: {
            id: group.id,
            openTabs: 'true',
        },
    })
}

function focusOnSearch(e: KeyboardEvent): void {
    if (!inpElem.value) {
        console.warn('Input element is not defined')
        return
    }

    if (e.key === 'Escape') {
        inpElem.value.blur()
    }

    // 🍏 Mac (cmd + k)
    if (e.key === 'k' && e.metaKey) {
        inpElem.value.focus()
    }

    // 🐧 Linux / 💩 Windows (ctrl + alt + k)
    if (e.key === 'k' && e.altKey && e.ctrlKey) {
        inpElem.value.focus()
    }
}

function filterGroups(): void {
    if (!inpElem.value) {
        console.warn('Input element is not defined')
        return
    }

    query.value = inpElem.value.value

    if (initialGroups.value.length === 0) {
        initialGroups.value = groupStore.groups
    }

    if (query.value === '') {
        groupStore.groups = initialGroups.value
        return
    }

    groupStore.groups = initialGroups.value.filter(group => {
        const nameMatch = group.name
            .toLowerCase()
            .includes(query.value.toLowerCase())

        if (nameMatch) {
            return true
        }

        return group.links.some(link =>
            link.title.toLowerCase().includes(query.value.toLowerCase()),
        )
    })
}

function hideInput(): void {
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
                'ring-0 focus:ring-2 focus:outline-none bg-transparent',
            ]"
            :placeholder="trans('group_name_or_tab_search')"
            @input="filterGroups"
            @blur="hideInput"
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
