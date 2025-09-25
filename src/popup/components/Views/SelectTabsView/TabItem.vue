<script setup lang="ts">
import type { Link } from '@/types'
import { computed } from 'vue'
import { useNewGroupStore } from '@/stores/newGroup'
import LinkElement from '@/components/LinkElement.vue'

const props = defineProps<{ link: Link }>()
const newGroupStore = useNewGroupStore()

const isSelected = computed<boolean>(() => {
    const selectedLinks = newGroupStore.choices.selectedLinks || []
    return selectedLinks.some(l => l.id === props.link.id)
})
</script>

<template>
    <LinkElement
        :isSelected
        :link
        @click="newGroupStore.toggleSelect(link)"
    >
        <label
            :class="[
                'w-4 h-4 shrink-0 border border-border flex items-center justify-center',
                'cursor-pointer rounded-full',
            ]"
        >
            <input
                @change="newGroupStore.toggleSelect(link)"
                type="checkbox"
                class="hidden"
            />

            <div v-if="isSelected" class="w-3 h-3 bg-private rounded-full"></div>
        </label>
    </LinkElement>
</template>
