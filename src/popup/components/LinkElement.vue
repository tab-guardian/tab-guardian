<script setup lang="ts">
import type { Link } from '@/types'
import { computed } from 'vue'
import LinkElementInner from '@/components/LinkElementInner.vue'

const props = defineProps<{
    link: Link
    isSelected?: boolean
}>()

const classes = computed(() => {
    const result = [
        'flex items-center gap-2 bg-page transition-colors cursor-pointer',
        'rounded-md border border-border p-2 hover:bg-page-hover',
        'justify-between w-full',
    ]

    if (props.isSelected) {
        result.push('bg-safe hover:bg-safe-hover')
    }

    return result
})
</script>

<template>
    <div :class="classes">
        <LinkElementInner :link />
        <slot />
    </div>
</template>
