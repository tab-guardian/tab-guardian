<script lang="ts" setup>
defineProps<{ field: string; value: string }>()
</script>

<template>
    <li class="grid grid-cols-2 break-words relative">
        <div class="relative z-10">
            <span class="bg-page pr-2">{{ field }}</span>
        </div>

        <div
            class="border-t border-border absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-50"
        ></div>

        <div class="text-right z-10 relative">
            <span class="bg-page pl-2">{{ value }}</span>
        </div>
    </li>
</template>
