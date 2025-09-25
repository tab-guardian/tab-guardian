<script setup lang="ts">
import type { Link } from '@/types'
import { useNewGroupStore } from '@/stores/newGroup'
import LinkElement from '@/components/LinkElement.vue'

const { link } = defineProps<{ link: Link }>()
const newGroupStore = useNewGroupStore()
</script>

<template>
    <LinkElement
        :isSelected="newGroupStore.selectedIds.includes(link.id)"
        :link
        @click="newGroupStore.toggleSelect(link.id)"
    >
        <label
            :class="[
                'w-4 h-4 shrink-0 border border-border flex items-center justify-center',
                'cursor-pointer rounded-full',
            ]"
        >
            <input
                @change="newGroupStore.toggleSelect(link.id)"
                type="checkbox"
                class="hidden"
            />

            <div
                v-if="newGroupStore.selectedIds.includes(link.id)"
                class="w-3 h-3 bg-private rounded-full"
            ></div>
        </label>
    </LinkElement>
</template>
