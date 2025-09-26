<script setup lang="ts">
import type { Link } from '@/types'
import LinkElement from '@/components/LinkElement.vue'

const emit = defineEmits<{
    (e: 'toggle'): void
}>()

defineProps<{
    link: Link
    isSelected: boolean
}>()
</script>

<template>
    <LinkElement @click="emit('toggle')" :isSelected :link>
        <label
            :class="[
                'w-4 h-4 shrink-0 border border-border flex items-center justify-center',
                'cursor-pointer rounded-full',
            ]"
        >
            <input @change="emit('toggle')" type="checkbox" class="hidden" />

            <div v-if="isSelected" class="w-3 h-3 bg-private rounded-full"></div>
        </label>
    </LinkElement>
</template>
