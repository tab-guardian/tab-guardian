<script lang="ts" setup>
defineProps<{ field: string; value: string }>()
</script>

<template>
    <li class="flex items-center justify-between wrap-break-words relative text-sm">
        <div class="relative bg-page pr-3 z-10">
            <span>{{ field }} <slot /></span>
        </div>

        <div
            class="border-t border-border absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-50"
        ></div>

        <div class="text-right z-10 relative max-w-52 bg-page pl-3 leading-4">
            <span>{{ value }}</span>
        </div>
    </li>
</template>
