<script setup lang="ts">
import type { Link } from '@common/types'
import { computed } from 'vue'

const props = defineProps<{
    link: Link
    isSelected?: boolean
    className?: string
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

    if (props.className) {
        result.push(props.className)
    }

    return result
})
</script>

<template>
    <div :class="classes">
        <div class="flex gap-3 items-center">
            <img :src="link.favIconUrl" alt="icon" class="size-7 rounded-md" />

            <div class="flex flex-col w-72 min-w-0">
                <h2
                    :title="link.title"
                    class="text-sm leading-4 overflow-hidden text-ellipsis text-nowrap"
                >
                    {{ link.title }}
                </h2>

                <p
                    :title="link.url"
                    class="overflow-hidden text-ellipsis text-nowrap text-xs text-font-gray"
                >
                    {{ link.url }}
                </p>
            </div>
        </div>

        <slot />
    </div>
</template>
