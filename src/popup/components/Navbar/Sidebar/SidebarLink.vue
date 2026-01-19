<script setup lang="ts">
import type { Component } from 'vue'

type Props = {
    label: string
    href: string
    icon: Component
}

defineProps<Props>()
</script>

<template>
    <a
        :href
        target="_blank"
        class="flex items-center gap-3 bg-page hover:bg-page-hover transition-colors px-4 py-2"
    >
        <component :is="icon" class="size-5" />
        <span class="text-sm">{{ label }}</span>
    </a>
</template>
