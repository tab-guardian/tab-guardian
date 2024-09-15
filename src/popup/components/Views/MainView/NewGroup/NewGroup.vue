<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTransStore } from '@/stores/trans'
import Buttons from '@/components/Views/MainView/NewGroup/Buttons.vue'
import MagnifyingGlassIcon from '@common/components/Icons/MagnifyingGlassIcon.vue'

const { trans } = useTransStore()
const displaySearch = ref<boolean>(false)
const query = ref<string>('')
const inpElem = ref<HTMLInputElement | null>(null)

onMounted(() => {
    document.addEventListener('keydown', handleSearch)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleSearch)
})

function handleSearch(e: KeyboardEvent): void {
    if (!inpElem.value) {
        console.warn('Input element is not defined')
        return
    }

    // if keys are shift, ctrl, alt, meta, etc. then return
    if (e.key.length > 1) {
        return
    }

    displaySearch.value = true

    inpElem.value.focus()

    if (inpElem.value.value === '') {
        query.value = e.key
    }
}

function hideInput(): void {
    if (!inpElem.value) {
        console.warn('Input element is not defined')
        return
    }

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
                v-model="query"
                ref="inpElem"
                type="search"
                class="w-full py-1 px-2 border border-border rounded-lg text-sm ring-0 focus:ring-2 focus:outline-none bg-transparent"
                :placeholder="trans('Group name or tab title to search...')"
                @blur="hideInput"
            />
        </div>

        <small v-if="!displaySearch" class="opacity-80 text-xs mt-1.5 block">
            {{ trans('Click the shield to save as a private group') }}
        </small>
    </div>
</template>
