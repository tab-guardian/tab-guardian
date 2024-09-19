<script setup lang="ts">
import type { Group } from '@/types'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import { ref, onMounted, onUnmounted } from 'vue'
import Buttons from '@/components/Views/MainView/NewGroup/Buttons.vue'
import MagnifyingGlassIcon from '@common/components/Icons/MagnifyingGlassIcon.vue'

const { trans } = useTransStore()
const groupStore = useGroupStore()

const initialGroups = ref<Group[]>([])
const inpElem = ref<HTMLInputElement | null>(null)
const displaySearch = ref<boolean>(false)
const query = ref<string>('')

// onMounted(() => {
//     document.addEventListener('keydown', handleSearch)
// })

// onUnmounted(() => {
//     document.removeEventListener('keydown', handleSearch)
// })

function handleSearch(e: KeyboardEvent): void {
    if (!inpElem.value) {
        console.warn('Input element is not defined')
        return
    }

    // if keys are shift, ctrl, alt, meta, etc. then return
    if (e.key.length > 1) {
        return
    }

    if (inpElem.value.value === '' && !displaySearch.value) {
        inpElem.value.value = e.key
    }

    displaySearch.value = true

    inpElem.value.focus()
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

    displaySearch.value = false
    query.value = ''
}
</script>

<template>
    <div class="text-center p-2 border-b border-border">
        <Buttons />

        <div v-show="displaySearch" class="flex items-center gap-2 mt-2">
            <MagnifyingGlassIcon class="size-6" />

            <input
                ref="inpElem"
                type="text"
                class="w-full py-1 px-2 border border-border rounded-lg text-sm ring-0 focus:ring-2 focus:outline-none bg-transparent"
                :placeholder="trans('Group name or tab title to search...')"
                @input="filterGroups"
                @blur="hideInput"
            />
        </div>

        <small v-if="!displaySearch" class="opacity-80 text-xs mt-1.5 block">
            {{ trans('Click the shield to save as a private group') }}
        </small>
    </div>
</template>
