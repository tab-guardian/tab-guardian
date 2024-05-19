<script setup lang="ts">
import type { Link } from '@/types'

type Props = {
    link: Link
}

const props = defineProps<Props>()
</script>

<template>
    <div class="flex gap-3 items-center">
        <img
            :src="props.link.favIconUrl"
            alt="icon"
            class="w-7 h-7 rounded-md"
        />

        <div class="flex flex-col w-64 min-w-0">
            <h2
                :title="props.link.title"
                class="text-sm leading-4 overflow-hidden text-ellipsis text-nowrap"
            >
                {{ props.link.title }}
            </h2>

            <p
                :title="props.link.url"
                class="overflow-hidden text-ellipsis text-nowrap text-xs text-font-gray"
            >
                {{ props.link.url }}
            </p>
        </div>
    </div>
</template>
