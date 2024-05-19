<script setup lang="ts">
import type { Link } from '@/types'
import { computed } from 'vue'
import LinkElementInner from '@/components/LinkElementInner.vue'

type Props = {
    isLink: boolean
    link: Link
    isSelected?: boolean
}

const props = defineProps<Props>()

const classes = computed(() => {
    const result = [
        'flex items-center gap-2 bg-page transition-colors cursor-pointer',
        'rounded-md border border-border p-2 hover:bg-page-hover',
        'justify-between w-full',
    ]

    if (props.isSelected) {
        result.push('bg-active hover:bg-active-hover')
    }

    return result
})
</script>

<template>
    <a v-if="props.isLink" :href="props.link.url" :class="classes">
        <LinkElementInner :link="props.link" />
        <slot />
    </a>

    <div v-else :class="classes">
        <LinkElementInner :link="props.link" />
        <slot />
    </div>
</template>
