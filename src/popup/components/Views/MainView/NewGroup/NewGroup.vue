<script setup lang="ts">
import { ref } from 'vue'
import { useTransStore } from '@/stores/trans'
import Buttons from '@/components/Views/MainView/NewGroup/Buttons.vue'
import MagnifyingGlassIcon from '@common/components/Icons/MagnifyingGlassIcon.vue'

const { trans } = useTransStore()
const displaySearch = ref<boolean>(true)
</script>

<template>
    <div class="text-center p-2 border-b border-border">
        <Buttons />

        <div v-if="displaySearch" class="flex items-center gap-2 mt-2">
            <MagnifyingGlassIcon class="size-6" />

            <input
                type="search"
                class="w-full py-1 px-2 border border-border rounded-lg text-sm ring-0 focus:ring-2 focus:outline-none"
                :placeholder="trans('Group name or tab title to search...')"
            />
        </div>

        <small v-else class="opacity-80 text-xs mt-1.5 block">
            {{ trans('Click the shield to save as a private group') }}
        </small>
    </div>
</template>
