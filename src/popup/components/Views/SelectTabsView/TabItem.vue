<script setup lang="ts">
import type { Link } from '@/types'
import { useSelectTabsStore } from '@/stores/selectTabs'
import LinkElement from '@/components/LinkElement.vue'

type Props = {
    link: Link
}

const { link } = defineProps<Props>()
const store = useSelectTabsStore()
</script>

<template>
    <LinkElement
        :isLink="false"
        :isSelected="store.selectedIds.includes(link.id)"
        :link
        @click="store.toggleSelect(link.id)"
    >
        <label
            :class="[
                'w-4 h-4 shrink-0 border border-border flex items-center justify-center',
                'cursor-pointer rounded-full',
            ]"
        >
            <input
                @change="store.toggleSelect(link.id)"
                type="checkbox"
                class="hidden"
            />

            <div
                v-if="store.selectedIds.includes(link.id)"
                class="w-3 h-3 bg-private rounded-full"
            ></div>
        </label>
    </LinkElement>
</template>
