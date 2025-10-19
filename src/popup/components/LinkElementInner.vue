<script setup lang="ts">
import type { Link } from '@common/types'

defineProps<{
    link: Link
}>()
</script>

<template>
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
</template>
