<script setup lang="ts">
defineProps<{ tip: string }>()
</script>

<template>
    <span
        v-tippy="tip"
        :class="[
            'border rounded-full size-4 text-center ml-1 cursor-pointer inline-flex items-center',
            'justify-center border-gray-500 text-xs font-heading',
        ]"
        >?</span
    >
</template>
