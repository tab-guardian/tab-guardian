<script setup lang="ts">
import type { Component } from 'vue'

type Props = {
    label: string
    icon: Component
}

const { label, icon } = defineProps<Props>()
</script>

<template>
    <a
        href="https://serhii.io/about-me"
        target="_blank"
        class="flex items-center gap-4 bg-page hover:bg-page-hover transition-colors px-4 py-2"
    >
        <component :is="icon" class="w-5 h-5" />
        <span class="text-md">{{ label }}</span>
    </a>
</template>
